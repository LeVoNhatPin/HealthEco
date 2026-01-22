// HealthEco.Core/Entities/DoctorSchedule.cs
namespace HealthEco.Core.Entities
{
    public class DoctorSchedule : BaseEntity
    {
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;

        public int FacilityId { get; set; }
        public MedicalFacility Facility { get; set; } = null!;

        public int DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        public int SlotDuration { get; set; } = 30; // minutes
        public int MaxPatientsPerSlot { get; set; } = 1;
        public bool IsActive { get; set; } = true;

        public DateTime ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }

        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}