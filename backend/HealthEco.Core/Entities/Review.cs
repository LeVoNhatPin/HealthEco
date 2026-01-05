namespace HealthEco.Core.Entities
{
    public class Review : BaseEntity
    {
        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; } = null!;
        public int PatientId { get; set; }
        public User Patient { get; set; } = null!;
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;
        public int FacilityId { get; set; }
        public MedicalFacility Facility { get; set; } = null!;
        public int? RatingDoctor { get; set; }
        public int? RatingFacility { get; set; }
        public string? CommentText { get; set; }
    }
}