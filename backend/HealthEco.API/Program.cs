using System.Text;
using HealthEco.Core.Configuration;
using HealthEco.Infrastructure.Data;
using HealthEco.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

#region Services

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Add detailed logging
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
    logging.SetMinimumLevel(LogLevel.Debug);
});

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "HealthEco API",
        Version = "v1",
        Description = "HealthEco Healthcare Booking Platform API"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "https://health-eco.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSettings);

var jwtSecret = jwtSettings["Secret"]
    ?? throw new InvalidOperationException("JWT Secret is missing");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();

// Application services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Cache
builder.Services.AddDistributedMemoryCache();

// ⭐⭐⭐ FIX RAILWAY DATABASE CONNECTION ⭐⭐⭐
string connectionString;

// Lấy connection string từ Railway biến môi trường
var railwayDbUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
var configConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Ưu tiên dùng DATABASE_URL từ Railway
if (!string.IsNullOrEmpty(railwayDbUrl))
{
    Console.WriteLine($"🔍 Found Railway DATABASE_URL: {railwayDbUrl.Substring(0, Math.Min(railwayDbUrl.Length, 50))}...");

    try
    {
        // Chuyển đổi từ URL sang connection string
        // DATABASE_URL có dạng: postgresql://user:password@host:port/dbname
        // Hoặc: postgres://user:password@host:port/dbname

        // Standardize the URL
        var dbUrl = railwayDbUrl;
        if (dbUrl.StartsWith("postgres://"))
        {
            dbUrl = dbUrl.Replace("postgres://", "postgresql://");
        }

        var uri = new Uri(dbUrl);
        var userInfo = uri.UserInfo.Split(':');

        if (userInfo.Length != 2)
        {
            throw new InvalidOperationException("Invalid DATABASE_URL format");
        }

        var username = userInfo[0];
        var password = userInfo[1];
        var host = uri.Host;
        var port = uri.Port > 0 ? uri.Port : 5432;
        var database = uri.LocalPath.TrimStart('/');

        // Xây dựng connection string cho Npgsql
        connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password};" +
                          "SSL Mode=Require;Trust Server Certificate=true;Pooling=true;";

        Console.WriteLine($"✅ Using Railway Database: {host}:{port}/{database}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error parsing DATABASE_URL: {ex.Message}");

        // Fallback to config if parsing fails
        if (!string.IsNullOrEmpty(configConnectionString))
        {
            connectionString = configConnectionString;
            Console.WriteLine($"⚠️ Falling back to configuration connection string");
        }
        else
        {
            throw new InvalidOperationException("No valid database connection found", ex);
        }
    }
}
else if (!string.IsNullOrEmpty(configConnectionString))
{
    // Dùng connection string từ config
    connectionString = configConnectionString;
    Console.WriteLine($"🔍 Using configuration connection string");
}
else
{
    throw new InvalidOperationException("No database connection string configured. " +
                                       "Please set DATABASE_URL environment variable or DefaultConnection in appsettings.json");
}

// Log connection info (without password)
var safeConnectionString = connectionString.Contains("Password=")
    ? connectionString.Substring(0, connectionString.IndexOf("Password=") + 9) + "***"
    : connectionString;
Console.WriteLine($"📊 Connection String: {safeConnectionString}");

// Database configuration
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorCodesToAdd: null);
    });

    // Enable detailed errors for debugging
    if (builder.Environment.IsDevelopment() || Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
    {
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
    }
});

// ✅ REGISTER SEED DATA
builder.Services.AddTransient<SeedData>();

#endregion

var app = builder.Build();

#region Middleware

// Enable detailed errors in production for debugging
app.UseDeveloperExceptionPage();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "HealthEco API V1");
    c.RoutePrefix = string.Empty; // Set Swagger UI at root
});

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

#endregion

#region Auto Migration + Seed

try
{
    Console.WriteLine("🚀 Starting database initialization...");

    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var logger = services.GetRequiredService<ILogger<Program>>();
        var context = services.GetRequiredService<ApplicationDbContext>();
        var seeder = services.GetRequiredService<SeedData>();

        logger.LogInformation("🔍 Testing database connection...");

        // Test connection with timeout
        var retryCount = 0;
        var maxRetries = 5;
        var connected = false;

        while (!connected && retryCount < maxRetries)
        {
            try
            {
                connected = await context.Database.CanConnectAsync();
                if (connected)
                {
                    logger.LogInformation("✅ Database connection successful!");
                }
                else
                {
                    logger.LogWarning($"⚠️ Cannot connect to database. Retry {retryCount + 1}/{maxRetries}...");
                    await Task.Delay(2000 * (retryCount + 1));
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"❌ Database connection error. Retry {retryCount + 1}/{maxRetries}...");
                await Task.Delay(2000 * (retryCount + 1));
            }
            retryCount++;
        }

        if (!connected)
        {
            logger.LogError("❌ Cannot connect to database after {MaxRetries} attempts!", maxRetries);
            throw new Exception("Database connection failed");
        }

        // Check for pending migrations
        var pendingMigrations = await context.Database.GetPendingMigrationsAsync();
        if (pendingMigrations.Any())
        {
            logger.LogInformation("📦 Applying {Count} pending migrations...", pendingMigrations.Count());
            await context.Database.MigrateAsync();
            logger.LogInformation("✅ Migrations applied successfully!");
        }
        else
        {
            logger.LogInformation("✅ No pending migrations.");
        }

        // Seed data
        logger.LogInformation("🌱 Seeding data...");
        await seeder.InitializeAsync(context);
        logger.LogInformation("✅ Data seeding completed!");
    }
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "💥 Error during startup initialization");

    // Log additional details for debugging
    Console.WriteLine($"🔴 Startup Error: {ex.Message}");
    if (ex.InnerException != null)
    {
        Console.WriteLine($"🔴 Inner Exception: {ex.InnerException.Message}");
    }
}

#endregion

Console.WriteLine("🎉 HealthEco API is starting...");
app.Run();