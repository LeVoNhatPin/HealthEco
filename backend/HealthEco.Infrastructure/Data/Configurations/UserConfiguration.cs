// HealthEco.Infrastructure/Data/Configurations/UserConfiguration.cs
using HealthEco.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HealthEco.Infrastructure.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");

            builder.HasKey(u => u.Id);

            builder.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(u => u.PasswordHash)
                .IsRequired();

            builder.Property(u => u.FullName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(u => u.Role)
                .IsRequired();

            builder.Property(u => u.IsEmailVerified)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(u => u.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            builder.Property(u => u.ThemePreference)
                .HasDefaultValue("light");

            builder.Property(u => u.LanguagePreference)
                .HasDefaultValue("vi");

            builder.Property(u => u.ReceiveNotifications)
                .HasDefaultValue(true);

            builder.Property(u => u.ReceiveMarketing)
                .HasDefaultValue(true);

            builder.Property(u => u.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            builder.Property(u => u.UpdatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            // Indexes
            builder.HasIndex(u => u.Email)
                .IsUnique();

            builder.HasIndex(u => u.PhoneNumber)
                .IsUnique()
                .HasFilter("[PhoneNumber] IS NOT NULL");
        }
    }
}