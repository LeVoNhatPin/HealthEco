namespace HealthEco.Core.DTOs.Schedule
{
    public class DoctorSlotDto
    {
        public DateTime Date { get; set; }        // Ngày khám
        public string StartTime { get; set; } = null!;
        public string EndTime { get; set; } = null!;
        public bool IsAvailable { get; set; }     // Còn trống hay không
    }
}
