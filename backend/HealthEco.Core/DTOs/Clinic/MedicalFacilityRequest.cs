// HealthEco.Core/DTOs/Clinic/MedicalFacilityRequest.cs
using HealthEco.Core.Entities.Enums;
using System.ComponentModel.DataAnnotations;

namespace HealthEco.Core.DTOs.Clinic
{
    public class MedicalFacilityRequest
    {
        [Required(ErrorMessage = "Tên cơ sở y tế là bắt buộc")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Loại cơ sở là bắt buộc")]
        public FacilityType FacilityType { get; set; }

        [Required(ErrorMessage = "Số giấy phép là bắt buộc")]
        public string LicenseNumber { get; set; }

        public string LicenseImageUrl { get; set; }

        [Required(ErrorMessage = "Địa chỉ là bắt buộc")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Thành phố là bắt buộc")]
        public string City { get; set; }

        [Required(ErrorMessage = "Số điện thoại là bắt buộc")]
        public string Phone { get; set; }

        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; }

        public string OperatingHours { get; set; }
        public string Services { get; set; }
        public string Description { get; set; }
        public string AvatarUrl { get; set; }
        public string BannerUrl { get; set; }
    }
}