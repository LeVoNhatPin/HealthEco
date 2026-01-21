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

            // Apply all configurations from assembly
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            // ⭐⭐⭐ THÊM CẤU HÌNH CHO USER ENTITY ⭐⭐⭐
            modelBuilder.Entity<User>(entity =>
            {
                // Thiết lập giá trị mặc định cho tất cả các cột boolean
                entity.Property(u => u.IsEmailVerified)
                    .IsRequired()
                    .HasDefaultValue(true);

                entity.Property(u => u.ReceiveNotifications)
                    .IsRequired()
                    .HasDefaultValue(true);

                entity.Property(u => u.ReceiveMarketing)
                    .IsRequired()
                    .HasDefaultValue(true);

                entity.Property(u => u.IsActive)
                    .IsRequired()
                    .HasDefaultValue(true);

                // Thiết lập giá trị mặc định cho các cột string
                entity.Property(u => u.ThemePreference)
                    .HasDefaultValue("light");

                entity.Property(u => u.LanguagePreference)
                    .HasDefaultValue("vi");

                // Thiết lập giá trị mặc định cho timestamps
                entity.Property(u => u.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(u => u.UpdatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                // Indexes để tối ưu performance
                entity.HasIndex(u => u.Email)
                    .IsUnique();

                entity.HasIndex(u => u.PhoneNumber)
                    .IsUnique()
                    .HasFilter("[PhoneNumber] IS NOT NULL");

                entity.HasIndex(u => u.IsActive);
                entity.HasIndex(u => u.IsEmailVerified);
                entity.HasIndex(u => u.Role);
            });

            // Fix DateOnly/TimeOnly for PostgreSQL
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    // Handle DateOnly
                    if (property.ClrType == typeof(DateOnly) || property.ClrType == typeof(DateOnly?))
                    {
                        property.SetColumnType("date");

                        // Add converter for DateOnly
                        var converterType = typeof(DateOnlyConverter<>).MakeGenericType(
                            property.ClrType == typeof(DateOnly) ? typeof(DateOnly) : typeof(DateOnly?));

                        var converter = (ValueConverter)Activator.CreateInstance(converterType)!;
                        property.SetValueConverter(converter);
                    }

                    // Handle TimeOnly
                    if (property.ClrType == typeof(TimeOnly) || property.ClrType == typeof(TimeOnly?))
                    {
                        property.SetColumnType("time");

                        // Add converter for TimeOnly
                        var converterType = typeof(TimeOnlyConverter<>).MakeGenericType(
                            property.ClrType == typeof(TimeOnly) ? typeof(TimeOnly) : typeof(TimeOnly?));

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