// HealthEco.Core/DTOs/Doctor/DoctorUpdateRequest.cs
using System.ComponentModel.DataAnnotations;

namespace HealthEco.Core.DTOs.Doctor
{
    public class DoctorUpdateRequest
    {
        public string? MedicalLicense { get; set; }
        public string? LicenseImageUrl { get; set; }

        public int? SpecializationId { get; set; }

        [Range(0, 100, ErrorMessage = "Số năm kinh nghiệm không hợp lệ")]
        public int YearsExperience { get; set; }

        public string? Qualifications { get; set; }
        public string? Bio { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Phí tư vấn không hợp lệ")]
        public decimal ConsultationFee { get; set; }
    }
}