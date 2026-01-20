// HealthEco.Core/DTOs/Clinic/MedicalFacilityResponse.cs
using System;
using HealthEco.Core.DTOs.Doctor;

namespace HealthEco.Core.DTOs.Clinic
{
    public class MedicalFacilityResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string FacilityType { get; set; }
        public int OwnerId { get; set; }
        public DoctorResponse Owner { get; set; }
        public string LicenseNumber { get; set; }
        public string LicenseImageUrl { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string OperatingHours { get; set; }
        public string Services { get; set; }
        public string Description { get; set; }
        public string AvatarUrl { get; set; }
        public string BannerUrl { get; set; }
        public bool IsActive { get; set; }
        public bool IsVerified { get; set; }
        public decimal Rating { get; set; }
        public int TotalReviews { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Additional calculated fields
        public int TotalDoctors { get; set; }
        public int TotalAppointments { get; set; }
    }
}