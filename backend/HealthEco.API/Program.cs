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

// ✅ FIX: Parse Railway DATABASE_URL
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
string connectionString;

if (!string.IsNullOrEmpty(databaseUrl))
{
    Console.WriteLine($"🔍 Found DATABASE_URL: {databaseUrl}");

    // Parse DATABASE_URL format: postgresql://user:password@host:port/database
    // Example: postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway

    var uri = new Uri(databaseUrl);
    var userInfo = uri.UserInfo.Split(':');

    if (userInfo.Length < 2)
    {
        throw new InvalidOperationException("Invalid DATABASE_URL format: missing user info");
    }

    var user = userInfo[0];
    var password = userInfo[1];
    var host = uri.Host;
    var port = uri.Port > 0 ? uri.Port : 5432;
    var database = uri.LocalPath.TrimStart('/');

    // Build connection string for Npgsql
    connectionString = $"Host={host};Port={port};Database={database};Username={user};Password={password};" +
                       "SSL Mode=Require;Trust Server Certificate=true";

    Console.WriteLine($"✅ Parsed connection: Host={host}, Port={port}, Database={database}, User={user}");
}
else
{
    // Fallback to configuration for local development
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("Connection string missing");

    Console.WriteLine($"🔍 Using configuration connection string");
}

Console.WriteLine($"📊 Connection String (sanitized): {connectionString.Replace("Password=", "Password=***")}");

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
    if (builder.Environment.IsDevelopment())
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

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseSwagger();
app.UseSwaggerUI();

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

        logger.LogInformation("🔍 Checking database connection...");

        // Test connection
        var canConnect = await context.Database.CanConnectAsync();
        if (!canConnect)
        {
            logger.LogError("❌ Cannot connect to database!");
            throw new Exception("Database connection failed");
        }

        logger.LogInformation("✅ Database connection successful!");

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
    // Don't throw here to see the actual error in logs
}

#endregion

Console.WriteLine("🎉 HealthEco API is starting...");
app.Run();