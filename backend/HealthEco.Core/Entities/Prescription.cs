namespace HealthEco.Core.Entities
{
    public class Prescription : BaseEntity
    {
        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; } = null!;
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;
        public int PatientId { get; set; }
        public User Patient { get; set; } = null!;
        public string Diagnosis { get; set; } = null!;
        public string? Advice { get; set; }
    }

    public class PrescriptionItem : BaseEntity
    {
        public int PrescriptionId { get; set; }
        public Prescription Prescription { get; set; } = null!;
        public string MedicineName { get; set; } = null!;
        public string Dosage { get; set; } = null!;
        public string Frequency { get; set; } = null!;
        public string Duration { get; set; } = null!;
        public int Quantity { get; set; }
    }
}