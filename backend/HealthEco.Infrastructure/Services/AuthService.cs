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
    public interface IAuthService
    {
        Task<(User user, string token, string refreshToken)> RegisterAsync(User user, string password);
        Task<(User user, string token, string refreshToken)> LoginAsync(string email, string password);
        Task<(User user, string token, string refreshToken)> RefreshTokenAsync(string token, string refreshToken);
        Task<bool> LogoutAsync(int userId);
        Task<User?> GetUserByEmailAsync(string email);
    }

    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtSettings _jwtSettings;
        private readonly IDistributedCache _cache;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            ApplicationDbContext context,
            IOptions<JwtSettings> jwtSettings,
            IDistributedCache cache,
            ILogger<AuthService> logger)
        {
            _context = context;
            _jwtSettings = jwtSettings.Value;
            _cache = cache;
            _logger = logger;
        }

        // ===================== REGISTER =====================
        public async Task<(User user, string token, string refreshToken)> RegisterAsync(User user, string password)
        {
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
                throw new AuthException("Email đã tồn tại");

            if (!IsPasswordValid(password))
                throw new AuthException("Mật khẩu không đủ mạnh");

            var newUser = new User
            {
                Email = user.Email.ToLower().Trim(),
                FullName = user.FullName.Trim(),
                PhoneNumber = user.PhoneNumber,
                DateOfBirth = user.DateOfBirth,
                Address = user.Address,
                City = user.City,
                Role = user.Role,

                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),

                IsEmailVerified = true,
                EmailVerifiedAt = DateTime.UtcNow,
                IsActive = true,

                ThemePreference = "light",
                LanguagePreference = "vi",
                ReceiveNotifications = true,
                ReceiveMarketing = true,

                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            await LogActivity(newUser.Id, "REGISTER", "Đăng ký tài khoản");

            var token = GenerateJwtToken(newUser);
            var refreshToken = GenerateRefreshToken();
            await StoreRefreshToken(newUser.Id, refreshToken);

            return (newUser, token, refreshToken);
        }

        // ===================== LOGIN =====================
        public async Task<(User user, string token, string refreshToken)> LoginAsync(string email, string password)
        {
            var user = await _context.Users
                .Include(u => u.Doctor)
                    .ThenInclude(d => d.Specialization)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                if (user != null)
                    await LogActivity(user.Id, "LOGIN_FAILED", "Sai mật khẩu");

                throw new AuthException("Email hoặc mật khẩu không đúng");
            }

            if (!user.IsActive)
                throw new AuthException("Tài khoản đã bị vô hiệu hóa");

            if (!user.IsEmailVerified)
                throw new AuthException("Vui lòng xác thực email");

            // Doctor rules
            if (user.Role == UserRole.Doctor)
            {
                if (user.Doctor == null)
                    throw new AuthException("Bác sĩ chưa có hồ sơ");

                if (!user.Doctor.IsVerified)
                    throw new AuthException("Bác sĩ chưa được xác thực");
            }

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();
            await StoreRefreshToken(user.Id, refreshToken);

            await LogActivity(user.Id, "LOGIN_SUCCESS", "Đăng nhập thành công");

            return (user, token, refreshToken);
        }

        // ===================== REFRESH TOKEN =====================
        public async Task<(User user, string token, string refreshToken)> RefreshTokenAsync(string token, string refreshToken)
        {
            var principal = GetPrincipalFromExpiredToken(token);
            var userId = int.Parse(principal.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var user = await _context.Users
                .Include(u => u.Doctor)
                    .ThenInclude(d => d.Specialization)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                throw new AuthException("Người dùng không tồn tại");

            var cacheKey = $"refresh_token_{userId}";
            var cachedToken = await _cache.GetStringAsync(cacheKey);

            if (cachedToken != refreshToken)
                throw new AuthException("Refresh token không hợp lệ");

            var newToken = GenerateJwtToken(user);
            var newRefreshToken = GenerateRefreshToken();
            await StoreRefreshToken(userId, newRefreshToken);

            return (user, newToken, newRefreshToken);
        }

        // ===================== LOGOUT =====================
        public async Task<bool> LogoutAsync(int userId)
        {
            await _cache.RemoveAsync($"refresh_token_{userId}");
            await LogActivity(userId, "LOGOUT", "Đăng xuất");
            return true;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.Doctor)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        // ===================== JWT =====================
        private string GenerateJwtToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(_jwtSettings.Secret);
            var tokenHandler = new JwtSecurityTokenHandler();

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName ?? ""),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim("avatar", user.AvatarUrl ?? ""),
                new Claim("theme", user.ThemePreference ?? "light")
            };

            if (user.Role == UserRole.Doctor && user.Doctor != null)
            {
                claims.Add(new Claim("doctorMedicalLicense", user.Doctor.MedicalLicense));
                claims.Add(new Claim("doctorSpecialization", user.Doctor.Specialization?.Name ?? ""));
                claims.Add(new Claim("doctorVerified", user.Doctor.IsVerified.ToString()));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        // ===================== HELPERS =====================
        private string GenerateRefreshToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        }

        private async Task StoreRefreshToken(int userId, string refreshToken)
        {
            await _cache.SetStringAsync(
                $"refresh_token_{userId}",
                refreshToken,
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow =
                        TimeSpan.FromDays(_jwtSettings.RefreshTokenExpirationDays)
                });
        }

        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token,
                new TokenValidationParameters
                {
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(_jwtSettings.Secret)),
                    ValidateLifetime = false
                },
                out _);

            return principal;
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
        {
            return System.Text.RegularExpressions.Regex.IsMatch(
                password,
                @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$");
        }
    }

    public class AuthException : Exception
    {
        public AuthException(string message) : base(message) { }
    }
}
