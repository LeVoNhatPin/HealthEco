namespace HealthEco.Core.Entities
{
    public class MedicalFacility : BaseEntity
    {
        public string Name { get; set; } = null!;
        public string Code { get; set; } = null!;
        public string FacilityType { get; set; } = null!;
        public int OwnerId { get; set; }
        public Doctor Owner { get; set; } = null!;
        public string LicenseNumber { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string City { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string? Email { get; set; }
        public string? OperatingHours { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsVerified { get; set; } = false;
    }
}