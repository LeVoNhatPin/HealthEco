namespace HealthEco.Core.DTOs.Schedule
{
    public class DoctorScheduleResponse
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        //public int FacilityId { get; set; }
        public string DayOfWeek { get; set; } = string.Empty;
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public int SlotDuration { get; set; }
        public int MaxPatientsPerSlot { get; set; }
        public bool IsActive { get; set; }
        public string ValidFrom { get; set; } = string.Empty;
        public string? ValidTo { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}