// 2. Sửa Doctor và các entities khác nếu cần
// HealthEco.Core/Entities/Doctor.cs - CẬP NHẬT
using System.Collections.Generic;

namespace HealthEco.Core.Entities
{
    public class Doctor : BaseEntity
    {
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public string MedicalLicense { get; set; } = null!;
        public string? LicenseImageUrl { get; set; }

        public int? SpecializationId { get; set; }
        public Specialization? Specialization { get; set; }

        public int YearsExperience { get; set; } = 0;
        public string? Qualifications { get; set; }
        public string? Bio { get; set; }

        public decimal ConsultationFee { get; set; } = 0;
        public decimal Rating { get; set; } = 0.00m;
        public int TotalReviews { get; set; } = 0;
        public bool IsVerified { get; set; } = false;

        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}