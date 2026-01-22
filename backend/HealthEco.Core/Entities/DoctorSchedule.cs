// HealthEco.Core/Entities/DoctorSchedule.cs
namespace HealthEco.Core.Entities
{
    public class DoctorSchedule : BaseEntity
    {
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;

        // ✅ Facility OPTIONAL
        public int? FacilityId { get; set; }
        public MedicalFacility? Facility { get; set; }

        // 0 = Sunday, 1 = Monday, ...
        public int DayOfWeek { get; set; }

        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        public int SlotDuration { get; set; } = 30;
        public int MaxPatientsPerSlot { get; set; } = 1;

        public bool IsActive { get; set; } = true;

        public DateTime ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
    }
}
