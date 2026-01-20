using HealthEco.Core.Entities;
using HealthEco.Core.Entities.Enums;

public class DoctorFacilityWork : BaseEntity
{
    public int DoctorId { get; set; }
    public Doctor Doctor { get; set; }

    public int FacilityId { get; set; }
    public MedicalFacility MedicalFacility { get; set; }

    public DoctorFacilityWorkType WorkType { get; set; }
    public DoctorFacilityWorkStatus Status { get; set; } = DoctorFacilityWorkStatus.Pending;

    public decimal? ConsultationFee { get; set; }
    public DateTime? ContractStartDate { get; set; }
    public DateTime? ContractEndDate { get; set; }
    public string WorkingHours { get; set; }
}
