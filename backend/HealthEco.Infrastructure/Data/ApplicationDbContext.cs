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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply all configurations from assembly
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

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