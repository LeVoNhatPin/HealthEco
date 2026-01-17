// HealthEco.Infrastructure/Services/IAuthService.cs
using HealthEco.Core.Entities;

namespace HealthEco.Infrastructure.Services
{
    public interface IAuthService
    {
        // Giữ nguyên tất cả các method
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

        string GenerateJwtToken(User user);
        string HashPassword(string password);
    }
}