namespace HealthEco.Core.DTOs.Clinic
{
    public class MedicalFacilityResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Code { get; set; } = null!;
        public string FacilityType { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string City { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string OperatingHours { get; set; } = null!;
        public bool IsActive { get; set; }
        public bool IsVerified { get; set; }
        public decimal Rating { get; set; }
        public int TotalReviews { get; set; }
    }
}