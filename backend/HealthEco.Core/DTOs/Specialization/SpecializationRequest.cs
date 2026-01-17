// HealthEco.Core/DTOs/Specialization/SpecializationRequest.cs
using System.ComponentModel.DataAnnotations;

namespace HealthEco.Core.DTOs.Specialization
{
    public class SpecializationRequest
    {
        [Required(ErrorMessage = "Tên chuyên khoa là bắt buộc")]
        public string Name { get; set; }

        public string Description { get; set; }
        public string IconUrl { get; set; }
        public bool IsActive { get; set; } = true;
    }
}