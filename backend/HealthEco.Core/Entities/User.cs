// 4. Sửa User
// HealthEco.Core/Entities/User.cs - CẬP NHẬT
using HealthEco.Core.Enums;

namespace HealthEco.Core.Entities
{
    public class User : BaseEntity
    {
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public UserRole Role { get; set; }
        public string? PhoneNumber { get; set; }
        public string? AvatarUrl { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }

        // Email verification
        public bool IsEmailVerified { get; set; } = true;
        public string? EmailVerificationToken { get; set; }
        public DateTime? EmailVerifiedAt { get; set; }

        // Password reset
        public string? ResetPasswordToken { get; set; }
        public DateTime? ResetPasswordExpires { get; set; }

        // Preferences
        public string? ThemePreference { get; set; } = "light";
        public string? LanguagePreference { get; set; } = "vi";
        public bool ReceiveNotifications { get; set; } = true;
        public bool ReceiveMarketing { get; set; } = true;

        // Status
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual Doctor? Doctor { get; set; }
    }
}