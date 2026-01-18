using HealthEco.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class DoctorConfiguration : IEntityTypeConfiguration<Doctor>
{
    public void Configure(EntityTypeBuilder<Doctor> builder)
    {
        builder.ToTable("Doctors");

        builder.HasKey(d => d.Id);

        builder.HasIndex(d => d.MedicalLicense).IsUnique();

        builder.Property(d => d.MedicalLicense)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(d => d.ConsultationFee)
            .HasColumnType("decimal(10,2)");

        builder.Property(d => d.Rating)
            .HasColumnType("decimal(3,2)")
            .HasDefaultValue(0);

        builder.HasOne(d => d.User)
            .WithOne(u => u.Doctor)
            .HasForeignKey<Doctor>(d => d.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
