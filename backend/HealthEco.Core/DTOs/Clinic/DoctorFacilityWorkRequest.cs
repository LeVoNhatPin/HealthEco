// HealthEco.Core/DTOs/Clinic/DoctorFacilityWorkRequest.cs
using HealthEco.Core.Entities.Enums;
using System;

namespace HealthEco.Core.DTOs.Clinic
{
    public class DoctorFacilityWorkRequest
    {
        public int DoctorId { get; set; }
        public int FacilityId { get; set; }
        public DoctorFacilityWorkType WorkType { get; set; }
        public decimal? ConsultationFee { get; set; }
        public DateTime? ContractStartDate { get; set; }
        public DateTime? ContractEndDate { get; set; }
        public string WorkingHours { get; set; }
    }
}