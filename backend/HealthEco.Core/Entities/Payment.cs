using HealthEco.Core.Enums;

namespace HealthEco.Core.Entities
{
    public class Payment : BaseEntity
    {
        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; } = null!;
        public string PaymentCode { get; set; } = null!;
        public decimal Amount { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        public DateTime? PaidAt { get; set; }
    }
}