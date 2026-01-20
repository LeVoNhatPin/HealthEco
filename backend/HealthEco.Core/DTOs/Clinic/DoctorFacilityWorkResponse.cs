// HealthEco.Core/DTOs/Clinic/DoctorFacilityWorkResponse.cs
using HealthEco.Core.DTOs.Doctor;
using System;

namespace HealthEco.Core.DTOs.Clinic
{
    public class DoctorFacilityWorkResponse
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public DoctorResponse Doctor { get; set; }
        public int FacilityId { get; set; }
        public MedicalFacilityResponse Facility { get; set; }
        public string WorkType { get; set; }
        public string Status { get; set; }
        public decimal? ConsultationFee { get; set; }
        public DateTime? ContractStartDate { get; set; }
        public DateTime? ContractEndDate { get; set; }
        public string WorkingHours { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}