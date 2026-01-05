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
        Task<bool> VerifyEmailAsync(string token);
        Task<string> GenerateEmailVerificationTokenAsync(User user);
        Task<string> GeneratePasswordResetTokenAsync(string email);
        Task<bool> ResetPasswordAsync(string token, string newPassword);
        Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
        Task<IEnumerable<ActivityLog>> GetUserActivityLogsAsync(int userId, int days = 30);
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

        public async Task<(User user, string token, string refreshToken)> RegisterAsync(User user, string password)
        {
            // Check if email exists
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                throw new AuthException("Email đã tồn tại");
            }

            // Validate password strength
            if (!IsPasswordValid(password))
            {
                throw new AuthException("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt");
            }

            // Hash password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);

            // Generate email verification token
            user.EmailVerificationToken = GenerateSecureToken();
            user.EmailVerifiedAt = null;
            user.IsEmailVerified = false;

            // Set default preferences
            user.ThemePreference = "light";
            user.LanguagePreference = "vi";
            user.ReceiveNotifications = true;
            user.ReceiveMarketing = true;

            // Add user
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            // Create activity log
            var activityLog = new ActivityLog
            {
                UserId = user.Id,
                Action = "REGISTER",
                Description = $"Đăng ký tài khoản mới với vai trò {user.Role}",
                CreatedAt = DateTime.UtcNow
            };
            await _context.ActivityLogs.AddAsync(activityLog);
            await _context.SaveChangesAsync();

            // Generate tokens
            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            // Store refresh token in cache
            await StoreRefreshToken(user.Id, refreshToken);

            return (user, token, refreshToken);
        }

        public async Task<(User user, string token, string refreshToken)> LoginAsync(string email, string password)
        {
            var user = await _context.Users
                .Include(u => u.Doctor)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                // Log failed attempt
                var failedLog = new ActivityLog
                {
                    UserId = user?.Id ?? 0,
                    Action = "LOGIN_FAILED",
                    Description = "Đăng nhập thất bại - Sai email hoặc mật khẩu",
                    CreatedAt = DateTime.UtcNow
                };
                await _context.ActivityLogs.AddAsync(failedLog);
                await _context.SaveChangesAsync();

                throw new AuthException("Email hoặc mật khẩu không đúng");
            }

            if (!user.IsActive)
            {
                throw new AuthException("Tài khoản đã bị vô hiệu hóa");
            }

            if (!user.IsEmailVerified)
            {
                throw new AuthException("Vui lòng xác thực email trước khi đăng nhập");
            }

            // Generate tokens
            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            // Store refresh token in cache
            await StoreRefreshToken(user.Id, refreshToken);

            // Create success activity log
            var activityLog = new ActivityLog
            {
                UserId = user.Id,
                Action = "LOGIN_SUCCESS",
                Description = "Đăng nhập thành công",
                CreatedAt = DateTime.UtcNow
            };
            await _context.ActivityLogs.AddAsync(activityLog);
            await _context.SaveChangesAsync();

            return (user, token, refreshToken);
        }

        public async Task<(User user, string token, string refreshToken)> RefreshTokenAsync(string token, string refreshToken)
        {
            var principal = GetPrincipalFromExpiredToken(token);
            var userId = int.Parse(principal.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new AuthException("Người dùng không tồn tại");
            }

            // Validate refresh token
            var cacheKey = $"refresh_token_{userId}";
            var cachedRefreshToken = await _cache.GetStringAsync(cacheKey);

            if (cachedRefreshToken != refreshToken)
            {
                throw new AuthException("Refresh token không hợp lệ");
            }

            // Generate new tokens
            var newToken = GenerateJwtToken(user);
            var newRefreshToken = GenerateRefreshToken();

            // Store new refresh token
            await StoreRefreshToken(user.Id, newRefreshToken);

            return (user, newToken, newRefreshToken);
        }

        public async Task<bool> LogoutAsync(int userId)
        {
            // Remove refresh token from cache
            var cacheKey = $"refresh_token_{userId}";
            await _cache.RemoveAsync(cacheKey);

            // Log logout activity
            var activityLog = new ActivityLog
            {
                UserId = userId,
                Action = "LOGOUT",
                Description = "Đăng xuất khỏi hệ thống",
                CreatedAt = DateTime.UtcNow
            };
            await _context.ActivityLogs.AddAsync(activityLog);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.Doctor)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> VerifyEmailAsync(string token)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.EmailVerificationToken == token);

            if (user == null)
            {
                throw new AuthException("Token xác thực không hợp lệ");
            }

            user.IsEmailVerified = true;
            user.EmailVerifiedAt = DateTime.UtcNow;
            user.EmailVerificationToken = null;

            await _context.SaveChangesAsync();

            // Log activity
            var activityLog = new ActivityLog
            {
                UserId = user.Id,
                Action = "EMAIL_VERIFIED",
                Description = "Xác thực email thành công",
                CreatedAt = DateTime.UtcNow
            };
            await _context.ActivityLogs.AddAsync(activityLog);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<string> GenerateEmailVerificationTokenAsync(User user)
        {
            user.EmailVerificationToken = GenerateSecureToken();
            await _context.SaveChangesAsync();
            return user.EmailVerificationToken;
        }

        public async Task<string> GeneratePasswordResetTokenAsync(string email)
        {
            var user = await GetUserByEmailAsync(email);
            if (user == null)
            {
                throw new AuthException("Không tìm thấy người dùng với email này");
            }

            user.ResetPasswordToken = GenerateSecureToken();
            user.ResetPasswordExpires = DateTime.UtcNow.AddHours(24);
            await _context.SaveChangesAsync();
            return user.ResetPasswordToken;
        }

        public async Task<bool> ResetPasswordAsync(string token, string newPassword)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.ResetPasswordToken == token && u.ResetPasswordExpires > DateTime.UtcNow);
            if (user == null)
            {
                throw new AuthException("Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.ResetPasswordToken = null;
            user.ResetPasswordExpires = null;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new AuthException("Người dùng không tồn tại");
            }

            if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            {
                throw new AuthException("Mật khẩu hiện tại không đúng");
            }

            if (!IsPasswordValid(newPassword))
            {
                throw new AuthException("Mật khẩu mới không đủ mạnh");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<ActivityLog>> GetUserActivityLogsAsync(int userId, int days = 30)
        {
            var fromDate = DateTime.UtcNow.AddDays(-days);
            return await _context.ActivityLogs
                .Where(log => log.UserId == userId && log.CreatedAt >= fromDate)
                .OrderByDescending(log => log.CreatedAt)
                .ToListAsync();
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtSettings.Secret);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Name, user.FullName),
                new Claim("role", user.Role.ToString()),
                new Claim("avatar", user.AvatarUrl ?? ""),
                new Claim("theme", user.ThemePreference ?? "light"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task StoreRefreshToken(int userId, string refreshToken)
        {
            var cacheKey = $"refresh_token_{userId}";
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(_jwtSettings.RefreshTokenExpirationDays)
            };
            await _cache.SetStringAsync(cacheKey, refreshToken, options);
        }

        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret)),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);

            if (securityToken is not JwtSecurityToken jwtSecurityToken ||
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Token không hợp lệ");
            }

            return principal;
        }

        private bool IsPasswordValid(string password)
        {
            // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
            var regex = new System.Text.RegularExpressions.Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$");
            return regex.IsMatch(password);
        }

        private string GenerateSecureToken()
        {
            return Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
        }
    }

    public class AuthException : Exception
    {
        public AuthException(string message) : base(message) { }
    }
}