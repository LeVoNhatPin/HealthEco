using HealthEco.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace HealthEco.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Doctor> Doctors => Set<Doctor>();
        public DbSet<ActivityLog> ActivityLogs => Set<ActivityLog>();

        // Add other DbSets as needed
        public DbSet<Appointment> Appointments => Set<Appointment>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<Prescription> Prescriptions => Set<Prescription>();
        public DbSet<PrescriptionItem> PrescriptionItems => Set<PrescriptionItem>();
        public DbSet<MedicalFacility> MedicalFacilities => Set<MedicalFacility>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<Specialization> Specializations => Set<Specialization>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();

                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Role).IsRequired().HasConversion<string>();
                entity.Property(e => e.PhoneNumber).HasMaxLength(20);
                entity.Property(e => e.AvatarUrl).HasMaxLength(500);
                entity.Property(e => e.City).HasMaxLength(100);
                entity.Property(e => e.EmailVerificationToken).HasMaxLength(100);
                entity.Property(e => e.ResetPasswordToken).HasMaxLength(100);
                entity.Property(e => e.ThemePreference).HasMaxLength(20);
                entity.Property(e => e.LanguagePreference).HasMaxLength(10);
            });

            // Doctor configuration
            modelBuilder.Entity<Doctor>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.MedicalLicense).IsUnique();

                entity.Property(e => e.MedicalLicense).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LicenseImageUrl).HasMaxLength(500);
                entity.Property(e => e.Qualifications).HasMaxLength(1000);
                entity.Property(e => e.Bio).HasMaxLength(2000);
                entity.Property(e => e.ConsultationFee).HasColumnType("decimal(10,2)");
                entity.Property(e => e.Rating).HasColumnType("decimal(3,2)");

                // Relationship with User
                entity.HasOne(d => d.User)
                    .WithOne(u => u.Doctor)
                    .HasForeignKey<Doctor>(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ActivityLog configuration
            modelBuilder.Entity<ActivityLog>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Action).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(500);
                entity.Property(e => e.IpAddress).HasMaxLength(50);
                entity.Property(e => e.UserAgent).HasMaxLength(500);
                entity.Property(e => e.Location).HasMaxLength(200);

                // Relationship with User
                entity.HasOne(a => a.User)
                    .WithMany()
                    .HasForeignKey(a => a.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Other entities can be configured similarly...
        }
    }
}