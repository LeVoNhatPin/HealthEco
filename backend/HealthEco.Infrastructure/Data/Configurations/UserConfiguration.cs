using HealthEco.Core.Entities;
using HealthEco.Core.Enums; // THÊM USING NÀY
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HealthEco.Infrastructure.Data.Configurations
{
    public class UserEntityConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");

            // ⭐⭐⭐ THÊM CONVERTER CHO ROLE - QUAN TRỌNG! ⭐⭐⭐
            builder.Property(u => u.Role)
                .HasConversion(
                    v => v.ToString(), // Convert enum to string when saving to DB
                    v => (UserRole)Enum.Parse(typeof(UserRole), v) // Convert string from DB to enum
                )
                .HasMaxLength(50);

            // Thiết lập giá trị mặc định cho tất cả các cột
            builder.Property(u => u.IsEmailVerified)
                .HasDefaultValue(true)
                .IsRequired();

            builder.Property(u => u.ReceiveNotifications)
                .HasDefaultValue(true)
                .IsRequired();

            builder.Property(u => u.ReceiveMarketing)
                .HasDefaultValue(true)
                .IsRequired();

            builder.Property(u => u.IsActive)
                .HasDefaultValue(true)
                .IsRequired();

            builder.Property(u => u.ThemePreference)
                .HasDefaultValue("light")
                .IsRequired(false);

            builder.Property(u => u.LanguagePreference)
                .HasDefaultValue("vi")
                .IsRequired(false);

            builder.Property(u => u.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .IsRequired();

            builder.Property(u => u.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .IsRequired();
        }
    }
}