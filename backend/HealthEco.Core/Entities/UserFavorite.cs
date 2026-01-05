using System.ComponentModel.DataAnnotations;
using System.Numerics;

namespace HealthEco.Core.Entities
{
    public class UserFavorite : BaseEntity
    {
        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int? DoctorId { get; set; }
        public Doctor? Doctor { get; set; }

        public int? FacilityId { get; set; }
        public MedicalFacility? Facility { get; set; }

        [Required]
        public string FavoriteType { get; set; } = null!; // DOCTOR, CLINIC

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }
}