using HealthEco.Core.Entities;
using HealthEco.Core.Entities.Enums;

public class MedicalFacility : BaseEntity
{
    public string Name { get; set; }
    public string Code { get; set; }

    public FacilityType FacilityType { get; set; }

    public string AvatarUrl { get; set; }
    public string BannerUrl { get; set; }


    public int OwnerId { get; set; }
    public Doctor Owner { get; set; }

    public string LicenseNumber { get; set; }
    public string LicenseImageUrl { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }

    public string OperatingHours { get; set; }
    public string Services { get; set; }
    public string Description { get; set; }

    public bool IsActive { get; set; }
    public bool IsVerified { get; set; }

    public decimal Rating { get; set; }
    public int TotalReviews { get; set; }

    public ICollection<DoctorFacilityWork> DoctorFacilityWorks { get; set; }
}
