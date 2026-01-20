using HealthEco.Core.Entities;
using HealthEco.Core.Entities.Enums;
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

                await context.SaveChangesAsync();

                // ============================
                // 4️⃣ TEST DOCTOR USER
                // ============================
                User doctorUser;
                if (!await context.Users.AnyAsync(u => u.Email == "doctor@test.com"))
                {
                    doctorUser = new User
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
                }
                else
                {
                    doctorUser = await context.Users.FirstAsync(u => u.Email == "doctor@test.com");
                }

                // ============================
                // 5️⃣ DOCTOR PROFILE
                // ============================
                Doctor doctor;
                if (!await context.Doctors.AnyAsync(d => d.UserId == doctorUser.Id))
                {
                    var specialization = await context.Specializations.FirstAsync();

                    doctor = new Doctor
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

                    await context.Doctors.AddAsync(doctor);
                    await context.SaveChangesAsync();

                    _logger.LogInformation("✅ Doctor profile created");
                }
                else
                {
                    doctor = await context.Doctors.FirstAsync(d => d.UserId == doctorUser.Id);
                }

                // ============================
                // 6️⃣ MEDICAL FACILITIES
                // ============================
                if (!await context.MedicalFacilities.AnyAsync())
                {
                    var clinics = new List<MedicalFacility>
                    {
                        new()
                        {
                            Name = "Phòng khám Đa khoa HealthEco Hà Nội",
                            Code = "CLINIC-20240101-1234",
                            FacilityType = FacilityType.Clinic,
                            OwnerId = doctor.Id,
                            LicenseNumber = "PK-001-HN-2024",
                            Address = "123 Trần Duy Hưng, Cầu Giấy",
                            City = "Hà Nội",
                            Phone = "02412345678",
                            Email = "hanoi@healtheco.com",
                            OperatingHours = "{}",
                            Services = "[]",
                            Description = "Phòng khám đa khoa hiện đại",
                            IsActive = true,
                            IsVerified = true,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        }
                    };

                    await context.MedicalFacilities.AddRangeAsync(clinics);
                    await context.SaveChangesAsync();

                    _logger.LogInformation("✅ Medical facilities seeded");

                    // ============================
                    // 7️⃣ DOCTOR FACILITY WORK
                    // ============================
                    var doctorFacilityWork = new DoctorFacilityWork
                    {
                        DoctorId = doctor.Id,
                        FacilityId = clinics.First().Id,
                        WorkType = DoctorFacilityWorkType.Employee,
                        Status = DoctorFacilityWorkStatus.Approved,
                        ConsultationFee = 300000,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    await context.DoctorFacilityWorks.AddAsync(doctorFacilityWork);
                    await context.SaveChangesAsync();

                    _logger.LogInformation("✅ DoctorFacilityWork created");
                }

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
