namespace HealthEco.Core.DTOs.Schedule
{
    public class DoctorScheduleRequest
    {
        public int FacilityId { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int SlotDuration { get; set; }
        public int MaxPatientsPerSlot { get; set; }
        public string ValidFrom { get; set; }
        public string? ValidTo { get; set; }
    }
}