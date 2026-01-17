// HealthEco.Core/DTOs/Doctor/DoctorResponse.cs
using System;

namespace HealthEco.Core.DTOs.Doctor
{
    public class DoctorResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public UserResponse User { get; set; } = new UserResponse();

        public string MedicalLicense { get; set; } = string.Empty;
        public string LicenseImageUrl { get; set; } = string.Empty;

        public int? SpecializationId { get; set; }
        public SpecializationResponse? Specialization { get; set; }

        public int YearsExperience { get; set; }
        public string Qualifications { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;

        public decimal ConsultationFee { get; set; }
        public decimal Rating { get; set; }
        public int TotalReviews { get; set; }

        public bool IsVerified { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}