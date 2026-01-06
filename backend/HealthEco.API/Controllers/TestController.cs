using HealthEco.Core.Entities;
using HealthEco.Core.Enums;
using HealthEco.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthEco.API.Controllers
{
    [Route("api/v1/test")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<TestController> _logger;
        private readonly IConfiguration _configuration;

        public TestController(
            ApplicationDbContext context,
            ILogger<TestController> logger,
            IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        [HttpGet("health")]
        public IActionResult HealthCheck()
        {
            _logger.LogInformation("Health check called");
            return Ok(new
            {
                status = "healthy",
                timestamp = DateTime.UtcNow,
                environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")
            });
        }

        [HttpGet("database")]
        public async Task<IActionResult> TestDatabase()
        {
            try
            {
                _logger.LogInformation("Testing database connection...");

                // Test raw connection
                await using var conn = _context.Database.GetDbConnection();
                await conn.OpenAsync();
                await conn.CloseAsync();

                // Test query
                var userCount = await _context.Users.CountAsync();

                return Ok(new
                {
                    success = true,
                    message = "Database connection successful",
                    userCount = userCount,
                    connectionString = _context.Database.GetConnectionString()?.Replace("Password=", "Password=***")
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Database test failed");
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message,
                    innerException = ex.InnerException?.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }

        [HttpGet("config")]
        public IActionResult GetConfig()
        {
            try
            {
                var config = new
                {
                    databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL"),
                    hasDatabaseUrl = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DATABASE_URL")),
                    jwtSecretLength = _configuration["JwtSettings:Secret"]?.Length,
                    connectionString = _configuration.GetConnectionString("DefaultConnection")?.Replace("Password=", "Password=***")
                };

                return Ok(config);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("create-test-user")]
        public async Task<IActionResult> CreateTestUser()
        {
            try
            {
                _logger.LogInformation("Creating test user...");

                var testUser = new User
                {
                    Email = "test@test.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test123!"),
                    FullName = "Test User",
                    Role = UserRole.Patient,
                    PhoneNumber = "0900000000",
                    IsActive = true,
                    IsEmailVerified = true,
                    EmailVerifiedAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Users.AddAsync(testUser);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Test user created",
                    userId = testUser.Id
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create test user");
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message,
                    innerException = ex.InnerException?.Message
                });
            }
        }

        [HttpGet("check-migrations")]
        public async Task<IActionResult> CheckMigrations()
        {
            try
            {
                var pendingMigrations = await _context.Database.GetPendingMigrationsAsync();
                var appliedMigrations = await _context.Database.GetAppliedMigrationsAsync();

                return Ok(new
                {
                    pending = pendingMigrations.ToList(),
                    applied = appliedMigrations.ToList(),
                    hasPending = pendingMigrations.Any()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}