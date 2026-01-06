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
                // Chỉ tạo admin nếu chưa có user nào
                if (!await context.Users.AnyAsync())
                {
                    _logger.LogInformation("Creating initial admin user...");

                    var admin = new User
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
                    };

                    await context.Users.AddAsync(admin);
                    await context.SaveChangesAsync();

                    _logger.LogInformation("✅ Admin user created with email: {Email}", admin.Email);
                }
                else
                {
                    _logger.LogInformation("✅ Database already has users, skipping seed.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error seeding database");
                // Không throw exception ở đây để không crash app
                _logger.LogWarning("Continuing without seed data...");
            }
        }
    }
}