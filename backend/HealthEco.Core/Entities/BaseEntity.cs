// 1. Sửa BaseEntity
// HealthEco.Core/Entities/BaseEntity.cs
using System.ComponentModel.DataAnnotations;

namespace HealthEco.Core.Entities
{
    public abstract class BaseEntity
    {
        [Key]
        public int Id { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}