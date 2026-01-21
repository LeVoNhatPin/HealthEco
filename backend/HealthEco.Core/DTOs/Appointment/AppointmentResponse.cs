using HealthEco.Core.DTOs.Doctor;

namespace HealthEco.Core.DTOs.Appointment
{
    public class AppointmentResponse
    {
        public int Id { get; set; }
        public string AppointmentCode { get; set; } = null!;
        public int PatientId { get; set; }
        public UserResponse Patient { get; set; } = null!;
        public int DoctorId { get; set; }
        public DoctorResponse Doctor { get; set; } = null!;
        public int FacilityId { get; set; }
        public object Facility { get; set; } = null!;
        public string AppointmentDate { get; set; } = string.Empty;
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public string AppointmentType { get; set; } = "IN_CLINIC";
        public string Status { get; set; } = "PENDING";
        public string? Symptoms { get; set; }
        public decimal ConsultationFee { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; } = "PENDING";
        public DateTime CreatedAt { get; set; }
    }
}