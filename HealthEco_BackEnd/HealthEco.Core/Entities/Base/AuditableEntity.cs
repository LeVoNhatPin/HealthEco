namespace HealthEco.Core.Entities.Base;

public abstract class AuditableEntity : BaseEntity
{
    public int? CreatedBy { get; set; }
    public int? UpdatedBy { get; set; }
}