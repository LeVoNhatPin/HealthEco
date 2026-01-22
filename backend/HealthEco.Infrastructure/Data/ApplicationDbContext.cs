using Microsoft.EntityFrameworkCore;
using HealthEco.Core.Entities;
using System.Reflection;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace HealthEco.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users => Set<User>();
        public DbSet<Doctor> Doctors => Set<Doctor>();
        public DbSet<ActivityLog> ActivityLogs => Set<ActivityLog>();

        // Thêm DbSet cho Specialization
        public DbSet<Specialization> Specializations => Set<Specialization>();

        public DbSet<DoctorSchedule> DoctorSchedules => Set<DoctorSchedule>();

        public DbSet<Appointment> Appointments => Set<Appointment>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<Review> Reviews => Set<Review>();

        public DbSet<MedicalFacility> MedicalFacilities => Set<MedicalFacility>();
        public DbSet<DoctorFacilityWork> DoctorFacilityWorks => Set<DoctorFacilityWork>();


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            // 🔥 FIX DoctorSchedule – Facility nullable
            modelBuilder.Entity<DoctorSchedule>(entity =>
            {
                entity.HasOne(s => s.Facility)
                    .WithMany()
                    .HasForeignKey(s => s.FacilityId)
                    .IsRequired(false) // ⭐ CỰC KỲ QUAN TRỌNG
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // =============================
            // DateOnly / TimeOnly converters (GIỮ NGUYÊN)
            // =============================
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateOnly) || property.ClrType == typeof(DateOnly?))
                    {
                        property.SetColumnType("date");

                        var converterType = typeof(DateOnlyConverter<>)
                            .MakeGenericType(property.ClrType);
                        var converter = (ValueConverter)Activator.CreateInstance(converterType)!;
                        property.SetValueConverter(converter);
                    }

                    if (property.ClrType == typeof(TimeOnly) || property.ClrType == typeof(TimeOnly?))
                    {
                        property.SetColumnType("time");

                        var converterType = typeof(TimeOnlyConverter<>)
                            .MakeGenericType(property.ClrType);
                        var converter = (ValueConverter)Activator.CreateInstance(converterType)!;
                        property.SetValueConverter(converter);
                    }
                }
            }
        }


        // Converter for DateOnly
        private class DateOnlyConverter<T> : ValueConverter<T, DateTime>
        {
            public DateOnlyConverter() : base(
                dateOnly => dateOnly != null ? ((DateOnly)(object)dateOnly!).ToDateTime(TimeOnly.MinValue) : default,
                dateTime => (T)(object)DateOnly.FromDateTime(dateTime))
            {
            }
        }

        // Converter for TimeOnly
        private class TimeOnlyConverter<T> : ValueConverter<T, TimeSpan>
        {
            public TimeOnlyConverter() : base(
                timeOnly => timeOnly != null ? ((TimeOnly)(object)timeOnly!).ToTimeSpan() : default,
                timeSpan => (T)(object)TimeOnly.FromTimeSpan(timeSpan))
            {
            }
        }
    }
}