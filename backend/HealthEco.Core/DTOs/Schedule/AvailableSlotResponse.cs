namespace HealthEco.Core.DTOs.Schedule
{
    public class AvailableSlotResponse
    {
        public string StartTime { get; set; } = null!;
        public string EndTime { get; set; } = null!;
        public bool IsAvailable { get; set; }
    }
}
