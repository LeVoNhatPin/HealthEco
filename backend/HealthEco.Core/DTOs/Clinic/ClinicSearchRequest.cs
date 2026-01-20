// HealthEco.Core/DTOs/Clinic/ClinicSearchRequest.cs
using HealthEco.Core.Entities.Enums;

namespace HealthEco.Core.DTOs.Clinic
{
    public class ClinicSearchRequest
    {
        public string SearchTerm { get; set; }
        public FacilityType? FacilityType { get; set; }
        public string City { get; set; }
        public string Service { get; set; }
        public bool? IsVerified { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string SortBy { get; set; } = "rating";
        public bool SortDescending { get; set; } = true;
    }
}