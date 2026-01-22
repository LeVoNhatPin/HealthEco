using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthEco.Core.DTOs.Appointment
{
    public class AppointmentResponseDto
    {
        public int Id { get; set; }
        public string AppointmentCode { get; set; } = null!;
        public DateOnly Date { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public string Status { get; set; } = null!;

        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = null!;
        public string? DoctorAvatar { get; set; }
    }

}
