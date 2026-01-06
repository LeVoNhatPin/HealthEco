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

        // Navigation properties (tạm thời comment để fix lỗi)
        public virtual Doctor? Doctor { get; set; }

        // Các navigation properties khác tạm thời bỏ qua
        // public virtual ICollection<Appointment> AppointmentsAsPatient { get; set; } = new List<Appointment>();
        // public virtual ICollection<Appointment> AppointmentsAsDoctor { get; set; } = new List<Appointment>();
        // public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        // public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
        // public virtual ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
    }
}