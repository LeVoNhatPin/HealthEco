// HealthEco.Core/DTOs/Schedule/DoctorScheduleRequest.cs
namespace HealthEco.Core.DTOs.Schedule
{
    public class DoctorScheduleRequest
    {

        // ❌ BỎ FacilityId
        // public int FacilityId { get; set; }

        public DayOfWeek DayOfWeek { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public int SlotDuration { get; set; }
        public int MaxPatientsPerSlot { get; set; }
        public string ValidFrom { get; set; } = string.Empty;
        public string? ValidTo { get; set; }
    }
}
