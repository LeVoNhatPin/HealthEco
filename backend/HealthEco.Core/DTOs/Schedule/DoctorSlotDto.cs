namespace HealthEco.Core.DTOs.Schedule
{
    public class DoctorSlotDto
    {
        public DateTime Date { get; set; }        // Ngày khám
        public TimeSpan StartTime { get; set; }   // Giờ bắt đầu
        public TimeSpan EndTime { get; set; }     // Giờ kết thúc
        public bool IsAvailable { get; set; }     // Còn trống hay không
    }
}
