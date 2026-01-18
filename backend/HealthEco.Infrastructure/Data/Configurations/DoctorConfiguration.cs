using HealthEco.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HealthEco.Infrastructure.Data.Configurations
{
    public class DoctorConfiguration : IEntityTypeConfiguration<Doctor>
    {
        public void Configure(EntityTypeBuilder<Doctor> builder)
        {
            builder.ToTable("Doctors");

            builder.HasKey(d => d.Id);

            builder.Property(d => d.MedicalLicense)
                .IsRequired()
                .HasMaxLength(100);

            builder.HasIndex(d => d.MedicalLicense)
                .IsUnique();

            builder.Property(d => d.LicenseImageUrl)
                .HasMaxLength(500);

            builder.Property(d => d.Qualifications)
                .HasMaxLength(1000);

            builder.Property(d => d.Bio)
                .HasMaxLength(2000);

            builder.Property(d => d.ConsultationFee)
                .HasColumnType("decimal(10,2)")
                .HasDefaultValue(0);

            builder.Property(d => d.Rating)
                .HasColumnType("decimal(3,2)")
                .HasDefaultValue(0.00m);

            builder.Property(d => d.TotalReviews)
                .HasDefaultValue(0);

            builder.Property(d => d.IsVerified)
                .HasDefaultValue(false);

            builder.Property(d => d.YearsExperience)
                .HasDefaultValue(0);
        }
    }
}