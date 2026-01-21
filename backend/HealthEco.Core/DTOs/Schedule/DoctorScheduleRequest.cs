namespace HealthEco.Core.DTOs.Schedule
{
    public class DoctorScheduleRequest
    {
        public int FacilityId { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public string StartTime { get; set; } = "08:00";
        public string EndTime { get; set; } = "17:00";
        public int SlotDuration { get; set; } = 30;
        public int MaxPatientsPerSlot { get; set; } = 1;
        public string ValidFrom { get; set; } = DateTime.Now.ToString("yyyy-MM-dd");
        public string? ValidTo { get; set; }
    }
}