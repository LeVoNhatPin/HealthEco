// HealthEco.Core/Entities/Specialization.cs
using System.Collections.Generic;

namespace HealthEco.Core.Entities
{
    public class Specialization : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string IconUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; }

        // Navigation properties
        public ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
    }
}