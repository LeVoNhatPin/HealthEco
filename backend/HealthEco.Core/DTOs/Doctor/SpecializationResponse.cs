// HealthEco.Core/DTOs/Doctor/SpecializationResponse.cs
namespace HealthEco.Core.DTOs.Doctor
{
    public class SpecializationResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string IconUrl { get; set; }
        public bool IsActive { get; set; }
    }
}