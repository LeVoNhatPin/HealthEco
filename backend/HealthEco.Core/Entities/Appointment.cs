using HealthEco.Core.Entities.Enums;
using HealthEco.Core.Enums;

namespace HealthEco.Core.Entities
{
    public class Appointment : BaseEntity
    {
        public int FacilityId { get; set; }

        public string AppointmentCode { get; set; } = null!;
        public int PatientId { get; set; }
        public User Patient { get; set; } = null!;
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;
        public DateOnly AppointmentDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public string AppointmentType { get; set; } = "IN_CLINIC";
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
        public string? Symptoms { get; set; }
        public decimal ConsultationFee { get; set; }
        public decimal TotalAmount { get; set; }
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    }
}