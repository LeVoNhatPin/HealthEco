using HealthEco.Core.Configuration;
using HealthEco.Core.Entities;
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
        Task<(User user, string token, string refreshToken)> LoginAsync(string email, string password);
        Task<(User user, string token, string refreshToken)> RegisterAsync(User user, string password);
        Task<bool> LogoutAsync(int userId);
    }

    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtSettings _jwt;
        private readonly IDistributedCache _cache;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            ApplicationDbContext context,
            IOptions<JwtSettings> jwt,
            IDistributedCache cache,
            ILogger<AuthService> logger)
        {
            _context = context;
            _jwt = jwt.Value;
            _cache = cache;
            _logger = logger;
        }

        // ===================== LOGIN =====================
        public async Task<(User user, string token, string refreshToken)> LoginAsync(string email, string password)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == email.ToLower());

            if (user == null)
                throw new AuthException("Email hoặc mật khẩu không đúng");

            if (string.IsNullOrEmpty(user.PasswordHash))
                throw new AuthException("Tài khoản chưa có mật khẩu");

            var validPassword = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            if (!validPassword)
                throw new AuthException("Email hoặc mật khẩu không đúng");

            if (!user.IsActive)
                throw new AuthException("Tài khoản đã bị khóa");

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            await StoreRefreshToken(user.Id, refreshToken);

            return (user, token, refreshToken);
        }

        // ===================== REGISTER =====================
        public async Task<(User user, string token, string refreshToken)> RegisterAsync(User user, string password)
        {
            if (await _context.Users.AnyAsync(x => x.Email == user.Email))
                throw new AuthException("Email đã tồn tại");

            user.Email = user.Email.ToLower().Trim();
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            user.IsActive = true;
            user.IsEmailVerified = true;
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();
            await StoreRefreshToken(user.Id, refreshToken);

            return (user, token, refreshToken);
        }

        // ===================== LOGOUT =====================
        public async Task<bool> LogoutAsync(int userId)
        {
            var key = $"refresh_token_{userId}";
            await _cache.RemoveAsync(key);
            return true;
        }

        // ===================== JWT =====================
        private string GenerateJwtToken(User user)
        {
            if (user == null)
                throw new Exception("User is null when generating JWT");

            var claims = new List<Claim>
            {
                // ⭐ FIX CHÍNH: NameIdentifier
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName ?? ""),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_jwt.Secret)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwt.AccessTokenExpirationMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ===================== REFRESH TOKEN =====================
        private string GenerateRefreshToken()
        {
            var bytes = RandomNumberGenerator.GetBytes(32);
            return Convert.ToBase64String(bytes);
        }

        private async Task StoreRefreshToken(int userId, string refreshToken)
        {
            var key = $"refresh_token_{userId}";
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow =
                    TimeSpan.FromDays(_jwt.RefreshTokenExpirationDays)
            };

            await _cache.SetStringAsync(key, refreshToken, options);
        }
    }

    // ===================== EXCEPTION =====================
    public class AuthException : Exception
    {
        public AuthException(string message) : base(message) { }
    }
}
