using HealthEco.Core.Entities;
using HealthEco.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HealthEco.Infrastructure.Data
{
    public class SeedData
    {
        private readonly ILogger<SeedData> _logger;

        public SeedData(ILogger<SeedData> logger)
        {
            _logger = logger;
        }

        public async Task InitializeAsync(ApplicationDbContext context)
        {
            _logger.LogInformation("🚀 Starting database seeding...");

            try
            {
                // ============================
                // 1️⃣ ADMIN USER
                // ============================
                if (!await context.Users.AnyAsync(u => u.Email == "admin@healtheco.com"))
                {
                    var admin = new User
                    {
                        Email = "admin@healtheco.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                        FullName = "System Administrator",
                        Role = UserRole.SystemAdmin,
                        PhoneNumber = "0900000000",
                        IsActive = true,
                        IsEmailVerified = true,
                        EmailVerifiedAt = DateTime.UtcNow,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    await context.Users.AddAsync(admin);
                    _logger.LogInformation("✅ Admin user created");
                }

                // ============================
                // 2️⃣ SPECIALIZATIONS
                // ============================
                if (!await context.Specializations.AnyAsync())
                {
                    _logger.LogInformation("📌 Seeding specializations...");

                    var specializations = new List<Specialization>
                    {
                        new()
                        {
                            Name = "Bác sĩ đa khoa",
                            Description = "Khám và điều trị các bệnh thông thường",
                            IconUrl = "/icons/general.png",
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new()
                        {
                            Name = "Tim mạch",
                            Description = "Chuyên khoa tim mạch",
                            IconUrl = "/icons/cardiology.png",
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new()
                        {
                            Name = "Da liễu",
                            Description = "Chuyên khoa da",
                            IconUrl = "/icons/dermatology.png",
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new()
                        {
                            Name = "Nhi khoa",
                            Description = "Chuyên khoa nhi",
                            IconUrl = "/icons/pediatrics.png",
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        }
                    };

                    await context.Specializations.AddRangeAsync(specializations);
                    _logger.LogInformation("✅ Specializations seeded");
                }

                await context.SaveChangesAsync();

                // ============================
                // 3️⃣ TEST PATIENT
                // ============================
                if (!await context.Users.AnyAsync(u => u.Email == "patient@test.com"))
                {
                    var patient = new User
                    {
                        Email = "patient@test.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Patient123!"),
                        FullName = "Test Patient",
                        Role = UserRole.Patient,
                        PhoneNumber = "0911111111",
                        City = "Hà Nội",
                        IsActive = true,
                        IsEmailVerified = true,
                        EmailVerifiedAt = DateTime.UtcNow,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    await context.Users.AddAsync(patient);
                    _logger.LogInformation("✅ Test patient created");
                }

                // ============================
                // 4️⃣ TEST DOCTOR USER
                // ============================
                if (!await context.Users.AnyAsync(u => u.Email == "doctor@test.com"))
                {
                    var doctorUser = new User
                    {
                        Email = "doctor@test.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor123!"),
                        FullName = "Bác sĩ Nguyễn Văn A",
                        Role = UserRole.Doctor,
                        PhoneNumber = "0922222222",
                        City = "Hà Nội",
                        IsActive = true,
                        IsEmailVerified = true,
                        EmailVerifiedAt = DateTime.UtcNow,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    await context.Users.AddAsync(doctorUser);
                    await context.SaveChangesAsync();

                    _logger.LogInformation("✅ Doctor user created");

                    // ============================
                    // 5️⃣ DOCTOR PROFILE
                    // ============================
                    var specialization = await context.Specializations.FirstAsync();

                    if (!await context.Doctors.AnyAsync(d => d.UserId == doctorUser.Id))
                    {
                        var doctorProfile = new Doctor
                        {
                            UserId = doctorUser.Id,
                            MedicalLicense = "BS-TEST-001",
                            LicenseImageUrl = "/licenses/doctor-test.png",
                            SpecializationId = specialization.Id,
                            YearsExperience = 8,
                            Qualifications = "Bác sĩ CKI - Đại học Y Hà Nội",
                            Bio = "Bác sĩ có nhiều năm kinh nghiệm khám và điều trị",
                            ConsultationFee = 300000,
                            Rating = 4.8m,
                            TotalReviews = 120,
                            IsVerified = true,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };

                        await context.Doctors.AddAsync(doctorProfile);
                        _logger.LogInformation("✅ Doctor profile created");
                    }
                }

                await context.SaveChangesAsync();
                _logger.LogInformation("🎉 Database seeding completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error during database seeding");
                throw;
            }
        }
    }
}
