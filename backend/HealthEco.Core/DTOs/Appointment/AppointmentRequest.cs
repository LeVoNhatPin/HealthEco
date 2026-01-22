using System.ComponentModel.DataAnnotations;

namespace HealthEco.Core.DTOs.Appointment
{
    public class AppointmentRequest
    {
        [Required]
        public int DoctorId { get; set; }

        [Required]
        public string AppointmentDate { get; set; } = string.Empty; // yyyy-MM-dd

        [Required]
        public string StartTime { get; set; } = string.Empty; // HH:mm

        public string? Symptoms { get; set; }
    }
}