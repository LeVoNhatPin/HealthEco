// HealthEco.Core/Entities/DoctorSchedule.cs
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthEco.Core.Entities
{
    public class DoctorSchedule : BaseEntity
    {
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;

        // ❌ BỎ TOÀN BỘ FACILITY
        // public int FacilityId { get; set; }
        // public MedicalFacility? Facility { get; set; }

        [Column("dateofweek")]

        public int DayOfWeek { get; set; } // 0-6

        [Column("starttime")]

        public TimeSpan StartTime { get; set; }

        [Column("endtime")]

        public TimeSpan EndTime { get; set; }

        [Column("slotduration")]

        public int SlotDuration { get; set; } = 30;
        [Column("maxpatientsperslot")]

        public int MaxPatientsPerSlot { get; set; } = 1;
        [Column("isactive")]

        public bool IsActive { get; set; } = true;
        [Column("validfrom")]

        public DateTime ValidFrom { get; set; }
        [Column("validto")]

        public DateTime? ValidTo { get; set; }

        [Column("createdat")]
        public DateTime CreatedAt { get; set; }

        [Column("updatedat")]
        public DateTime? UpdatedAt { get; set; }
    }
}
