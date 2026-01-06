using System.ComponentModel.DataAnnotations;

namespace HealthEco.Core.Entities
{
    public class Specialization : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        [MaxLength(500)]
        public string? IconUrl { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
    }
}