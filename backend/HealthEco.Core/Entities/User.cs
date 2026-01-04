using System.ComponentModel.DataAnnotations;
using HealthEco.Core.Entities.Enums;

namespace HealthEco.Core.Entities
{
    public class User : BaseEntity
    {
        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = null!;

        [Required]
        public string PasswordHash { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = null!;

        [Required]
        public UserRole Role { get; set; }

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        public string? AvatarUrl { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public bool IsActive { get; set; } = true;
    }
}