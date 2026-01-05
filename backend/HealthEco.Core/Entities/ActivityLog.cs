using System.ComponentModel.DataAnnotations;

namespace HealthEco.Core.Entities
{
    public class ActivityLog : BaseEntity
    {
        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string Action { get; set; } = null!; // LOGIN, REGISTER, UPDATE_PROFILE, etc.

        [Required]
        public string Description { get; set; } = null!;

        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public string? Location { get; set; }
    }
}