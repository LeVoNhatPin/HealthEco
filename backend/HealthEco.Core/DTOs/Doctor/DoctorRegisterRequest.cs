// HealthEco.Core/DTOs/Doctor/DoctorRegisterRequest.cs
using System;
using System.ComponentModel.DataAnnotations;

namespace HealthEco.Core.DTOs.Doctor
{
    public class DoctorRegisterRequest
    {
        // User information
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Họ tên là bắt buộc")]
        public string FullName { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }

        // Doctor specific
        [Required(ErrorMessage = "Số giấy phép hành nghề là bắt buộc")]
        public string MedicalLicense { get; set; } = string.Empty;

        public string? LicenseImageUrl { get; set; }

        [Required(ErrorMessage = "Chuyên khoa là bắt buộc")]
        public int SpecializationId { get; set; }

        public int YearsExperience { get; set; }

        [Required(ErrorMessage = "Bằng cấp là bắt buộc")]
        public string Qualifications { get; set; } = string.Empty;

        public string? Bio { get; set; }

        [Required(ErrorMessage = "Phí tư vấn là bắt buộc")]
        [Range(0, double.MaxValue, ErrorMessage = "Phí tư vấn không hợp lệ")]
        public decimal ConsultationFee { get; set; }
    }
}