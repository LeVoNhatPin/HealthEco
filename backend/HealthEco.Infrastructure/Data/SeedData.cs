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
            try
            {
                _logger.LogInformation("Starting database seeding...");

                // Seed Users
                await SeedUsersAsync(context);

                // Seed Specializations (nếu có)
                await SeedSpecializationsAsync(context);

                _logger.LogInformation("Database seeding completed!");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding database");
                throw;
            }
        }

        private async Task SeedUsersAsync(ApplicationDbContext context)
        {
            if (!await context.Users.AnyAsync())
            {
                _logger.LogInformation("Seeding users...");

                var users = new List<User>
                {
                    new User
                    {
                        Email = "admin@healtheco.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                        FullName = "System Administrator",
                        Role = UserRole.SystemAdmin,
                        PhoneNumber = "0987654321",
                        IsActive = true,
                        IsEmailVerified = true,
                        EmailVerifiedAt = DateTime.UtcNow,
                        CreatedAt = DateTime.UtcNow
                    },
                    new User
                    {
                        Email = "doctor@healtheco.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor123!"),
                        FullName = "Dr. John Smith",
                        Role = UserRole.Doctor,
                        PhoneNumber = "0912345678",
                        IsActive = true,
                        IsEmailVerified = true,
                        EmailVerifiedAt = DateTime.UtcNow,
                        CreatedAt = DateTime.UtcNow
                    },
                    new User
                    {
                        Email = "patient@healtheco.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Patient123!"),
                        FullName = "Jane Doe",
                        Role = UserRole.Patient,
                        PhoneNumber = "0909123456",
                        DateOfBirth = new DateOnly(1990, 1, 1),
                        Address = "123 Main Street",
                        City = "Hanoi",
                        IsActive = true,
                        IsEmailVerified = true,
                        EmailVerifiedAt = DateTime.UtcNow,
                        CreatedAt = DateTime.UtcNow
                    },
                    new User
                    {
                        Email = "clinic@healtheco.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Clinic123!"),
                        FullName = "Clinic Manager",
                        Role = UserRole.ClinicAdmin,
                        PhoneNumber = "0978123456",
                        IsActive = true,
                        IsEmailVerified = true,
                        EmailVerifiedAt = DateTime.UtcNow,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                await context.Users.AddRangeAsync(users);
                await context.SaveChangesAsync();

                // Seed Doctor entity
                var doctorUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "doctor@healtheco.com");
                if (doctorUser != null)
                {
                    var doctor = new Doctor
                    {
                        UserId = doctorUser.Id,
                        MedicalLicense = "LIC-001",
                        YearsExperience = 10,
                        Qualifications = "MD, PhD",
                        Bio = "Experienced general practitioner",
                        ConsultationFee = 500000,
                        IsVerified = true,
                        CreatedAt = DateTime.UtcNow
                    };

                    await context.Doctors.AddAsync(doctor);
                    await context.SaveChangesAsync();
                }

                _logger.LogInformation("Seeded {Count} users", users.Count);
            }
            else
            {
                _logger.LogInformation("Users already exist, skipping seeding.");
            }
        }

        private async Task SeedSpecializationsAsync(ApplicationDbContext context)
        {
            if (!await context.Specializations.AnyAsync())
            {
                _logger.LogInformation("Seeding specializations...");

                var specializations = new List<Specialization>
                {
                    new Specialization { Name = "General Practitioner", Description = "Primary care doctor", IsActive = true, CreatedAt = DateTime.UtcNow },
                    new Specialization { Name = "Cardiologist", Description = "Heart specialist", IsActive = true, CreatedAt = DateTime.UtcNow },
                    new Specialization { Name = "Dermatologist", Description = "Skin specialist", IsActive = true, CreatedAt = DateTime.UtcNow },
                    new Specialization { Name = "Pediatrician", Description = "Children's doctor", IsActive = true, CreatedAt = DateTime.UtcNow },
                    new Specialization { Name = "Orthopedic Surgeon", Description = "Bone and joint specialist", IsActive = true, CreatedAt = DateTime.UtcNow }
                };

                await context.Specializations.AddRangeAsync(specializations);
                await context.SaveChangesAsync();

                _logger.LogInformation("Seeded {Count} specializations", specializations.Count);
            }
        }
    }
}