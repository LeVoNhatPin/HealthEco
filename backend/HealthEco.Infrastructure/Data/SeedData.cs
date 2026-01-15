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
            _logger.LogInformation("Starting database seeding...");

            try
            {
                // Tạo admin nếu chưa có
                if (!await context.Users.AnyAsync(u => u.Email == "admin@healtheco.com"))
                {
                    _logger.LogInformation("Creating admin user...");

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
                    _logger.LogInformation("✅ Admin user created: {Email}", admin.Email);
                }

                // Tạo test patient
                if (!await context.Users.AnyAsync(u => u.Email == "patient@test.com"))
                {
                    _logger.LogInformation("Creating test patient...");

                    var patient = new User
                    {
                        Email = "patient@test.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Patient123!"),
                        FullName = "Test Patient",
                        Role = UserRole.Patient,
                        PhoneNumber = "0911111111",
                        IsActive = true,
                        IsEmailVerified = true,
                        EmailVerifiedAt = DateTime.UtcNow,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    await context.Users.AddAsync(patient);
                    _logger.LogInformation("✅ Test patient created: {Email}", patient.Email);
                }

                // Tạo test doctor
                if (!await context.Users.AnyAsync(u => u.Email == "doctor@test.com"))
                {
                    _logger.LogInformation("Creating test doctor...");

                    var doctor = new User
                    {
                        Email = "doctor@test.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor123!"),
                        FullName = "Test Doctor",
                        Role = UserRole.Doctor,
                        PhoneNumber = "0922222222",
                        IsActive = true,
                        IsEmailVerified = true,
                        EmailVerifiedAt = DateTime.UtcNow,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    await context.Users.AddAsync(doctor);
                    _logger.LogInformation("✅ Test doctor created: {Email}", doctor.Email);
                }

                await context.SaveChangesAsync();
                _logger.LogInformation("✅ Database seeding completed successfully!");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error seeding database");
                throw;
            }
        }
    }
}