using HealthEco.Core.Configuration;
using HealthEco.Core.Entities;
using HealthEco.Core.Enums;
using HealthEco.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace HealthEco.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtSettings _jwt;
        private readonly IDistributedCache _cache;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            ApplicationDbContext context,
            IOptions<JwtSettings> jwtOptions,
            IDistributedCache cache,
            ILogger<AuthService> logger)
        {
            _context = context;
            _jwt = jwtOptions.Value;
            _cache = cache;
            _logger = logger;
        }

        // ========================= REGISTER =========================
        public async Task<(User user, string token, string refreshToken)> RegisterAsync(User user, string password)
        {
            if (await _context.Users.AnyAsync(x => x.Email == user.Email))
                throw new AuthException("Email đã tồn tại");

            if (!IsPasswordValid(password))
                throw new AuthException("Mật khẩu không đủ mạnh");

            user.Email = user.Email.ToLower().Trim();
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            user.IsEmailVerified = true;
            user.IsActive = true;
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            user.ThemePreference ??= "light";
            user.LanguagePreference ??= "vi";
            user.ReceiveNotifications = true;
            user.ReceiveMarketing = true;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            await LogActivity(user.Id, "REGISTER", "Đăng ký tài khoản");

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();
            await StoreRefreshToken(user.Id, refreshToken);

            return (user, token, refreshToken);
        }

        // ========================= LOGIN =========================


        public async Task<(User user, string token, string refreshToken)> LoginAsync(string email, string password)
        {
            try
            {
                _logger.LogInformation($"Login attempt for email: {email}");

                // CHỈ LẤY USER, KHÔNG INCLUDE
                var user = await _context.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.Email == email);

                if (user == null)
                {
                    _logger.LogWarning($"User not found for email: {email}");
                    throw new AuthException("Email hoặc mật khẩu không đúng");
                }

                // KIỂM TRA PASSWORD HASH
                if (string.IsNullOrEmpty(user.PasswordHash))
                {
                    _logger.LogError($"User {user.Id} has null or empty PasswordHash");
                    throw new AuthException("Tài khoản không hợp lệ. Vui lòng reset mật khẩu.");
                }

                // KIỂM TRA FORMAT PASSWORD HASH
                bool isBcryptHash = user.PasswordHash.StartsWith("$2a$") ||
                                    user.PasswordHash.StartsWith("$2b$") ||
                                    user.PasswordHash.StartsWith("$2y$");

                if (!isBcryptHash)
                {
                    _logger.LogError($"User {user.Id} has non-BCrypt password hash: {user.PasswordHash.Substring(0, Math.Min(20, user.PasswordHash.Length))}");

                    // TỰ ĐỘNG CONVERT NẾU CẦN
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Converted password hash to BCrypt for user {user.Id}");
                }

                // VERIFY PASSWORD
                bool passwordValid;
                try
                {
                    passwordValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"BCrypt verification failed for user {user.Id}");
                    throw new AuthException("Lỗi xác thực mật khẩu");
                }

                if (!passwordValid)
                {
                    _logger.LogWarning($"Invalid password for email: {email}");
                    throw new AuthException("Email hoặc mật khẩu không đúng");
                }

                if (!user.IsActive)
                {
                    _logger.LogWarning($"User account inactive: {email}");
                    throw new AuthException("Tài khoản bị khóa");
                }

                if (!user.IsEmailVerified)
                {
                    _logger.LogWarning($"Email not verified: {email}");
                    throw new AuthException("Email chưa xác thực");
                }

                // TẠO TOKEN
                var token = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();
                await StoreRefreshToken(user.Id, refreshToken);

                _logger.LogInformation($"Login successful, user ID: {user.Id}, Role: {user.Role}");

                await LogActivity(user.Id, "LOGIN_SUCCESS", "Đăng nhập thành công");

                return (user, token, refreshToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in LoginAsync for email: {email}");
                throw;
            }
        }

        // ========================= REFRESH TOKEN =========================
        public async Task<(User user, string token, string refreshToken)> RefreshTokenAsync(string token, string refreshToken)
        {
            var principal = GetPrincipalFromExpiredToken(token);
            var userId = int.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var cached = await _cache.GetStringAsync($"refresh_token_{userId}");
            if (cached != refreshToken)
                throw new AuthException("Refresh token không hợp lệ");

            var user = await _context.Users
                .Include(x => x.Doctor)
                .ThenInclude(d => d.Specialization)
                .FirstOrDefaultAsync(x => x.Id == userId);

            if (user == null)
                throw new AuthException("User không tồn tại");

            var newToken = GenerateJwtToken(user);
            var newRefresh = GenerateRefreshToken();
            await StoreRefreshToken(user.Id, newRefresh);

            return (user, newToken, newRefresh);
        }

        // ========================= LOGOUT =========================
        public async Task<bool> LogoutAsync(int userId)
        {
            await _cache.RemoveAsync($"refresh_token_{userId}");
            await LogActivity(userId, "LOGOUT", "Đăng xuất");
            return true;
        }

        // ========================= EMAIL =========================
        public async Task<User?> GetUserByEmailAsync(string email)
            => await _context.Users.FirstOrDefaultAsync(x => x.Email == email);

        public async Task<bool> VerifyEmailAsync(string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.EmailVerificationToken == token);
            if (user == null) throw new AuthException("Token không hợp lệ");

            user.IsEmailVerified = true;
            user.EmailVerifiedAt = DateTime.UtcNow;
            user.EmailVerificationToken = null;
            await _context.SaveChangesAsync();

            await LogActivity(user.Id, "EMAIL_VERIFIED", "Xác thực email");

            return true;
        }

        public async Task<string> GenerateEmailVerificationTokenAsync(User user)
        {
            user.EmailVerificationToken = GenerateSecureToken();
            await _context.SaveChangesAsync();
            return user.EmailVerificationToken;
        }

        // ========================= PASSWORD =========================
        public async Task<string> GeneratePasswordResetTokenAsync(string email)
        {
            var user = await GetUserByEmailAsync(email);
            if (user == null) throw new AuthException("Không tìm thấy user");

            user.ResetPasswordToken = GenerateSecureToken();
            user.ResetPasswordExpires = DateTime.UtcNow.AddHours(24);
            await _context.SaveChangesAsync();

            return user.ResetPasswordToken;
        }

        public async Task<bool> ResetPasswordAsync(string token, string newPassword)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x =>
                x.ResetPasswordToken == token && x.ResetPasswordExpires > DateTime.UtcNow);

            if (user == null) throw new AuthException("Token không hợp lệ");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.ResetPasswordToken = null;
            user.ResetPasswordExpires = null;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new AuthException("User không tồn tại");

            if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
                throw new AuthException("Mật khẩu hiện tại sai");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _context.SaveChangesAsync();

            return true;
        }

        // ========================= ACTIVITY LOG =========================
        public async Task<IEnumerable<ActivityLog>> GetUserActivityLogsAsync(int userId, int days = 30)
        {
            var from = DateTime.UtcNow.AddDays(-days);
            return await _context.ActivityLogs
                .Where(x => x.UserId == userId && x.CreatedAt >= from)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        // ========================= TOKEN CORE =========================
        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Secret));

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Name, user.FullName ?? ""),
        new Claim(ClaimTypes.Role, user.Role.ToString()) // Đây là enum UserRole
    };

            // THÊM LOG để debug
            _logger.LogInformation($"Generating JWT for user: {user.Email}, Role: {user.Role}");

            // Xóa phần doctor claims nếu không cần thiết cho patient
            // if (user.Role == UserRole.Doctor && user.Doctor != null)
            // {
            //     claims.Add(new Claim("doctorVerified", user.Doctor.IsVerified.ToString()));
            //     claims.Add(new Claim("doctorLicense", user.Doctor.MedicalLicense));
            // }

            var token = new JwtSecurityToken(
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwt.AccessTokenExpirationMinutes),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var parameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Secret)),
                ValidateLifetime = false
            };

            return new JwtSecurityTokenHandler().ValidateToken(token, parameters, out _);
        }

        private string GenerateRefreshToken()
            => Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

        private async Task StoreRefreshToken(int userId, string refreshToken)
        {
            await _cache.SetStringAsync(
                $"refresh_token_{userId}",
                refreshToken,
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(_jwt.RefreshTokenExpirationDays)
                });
        }

        private async Task LogActivity(int userId, string action, string desc)
        {
            await _context.ActivityLogs.AddAsync(new ActivityLog
            {
                UserId = userId,
                Action = action,
                Description = desc,
                CreatedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }

        private bool IsPasswordValid(string password)
            => System.Text.RegularExpressions.Regex.IsMatch(
                password,
                @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$");

        private string GenerateSecureToken()
            => Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
    }

    public class AuthException : Exception
    {
        public AuthException(string message) : base(message) { }
    }
}
