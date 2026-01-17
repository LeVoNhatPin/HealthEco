// HealthEco.Core/DTOs/Doctor/DoctorSearchRequest.cs
namespace HealthEco.Core.DTOs.Doctor
{
    public class DoctorSearchRequest
    {
        public string? SearchTerm { get; set; }
        public int? SpecializationId { get; set; }
        public string? City { get; set; }
        public decimal? MinFee { get; set; }
        public decimal? MaxFee { get; set; }
        public bool? IsVerified { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SortBy { get; set; } = "rating";
        public bool SortDescending { get; set; } = true;
    }
}