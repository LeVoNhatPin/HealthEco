using HealthEco.Core.Interfaces;
using HealthEco.Infrastructure.Data;
using HealthEco.Infrastructure.Identity;
using HealthEco.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Npgsql; // Add this using

var builder = WebApplication.CreateBuilder(args);

/// =======================================================
/// 🚀 REQUIRED FOR RAILWAY (PORT 8080)
/// =======================================================
builder.WebHost.UseUrls("http://0.0.0.0:8080");

/// =======================================================
/// SERVICES
/// =======================================================

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "HealthEco API",
        Version = "v1"
    });

    // JWT in Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Authorization: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
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

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Database - FIXED FOR RAILWAY
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
string connectionString;

if (!string.IsNullOrEmpty(databaseUrl))
{
    // Parse the DATABASE_URL from Railway
    var uri = new Uri(databaseUrl);
    var userInfo = uri.UserInfo.Split(':');

    var npgsqlBuilder = new NpgsqlConnectionStringBuilder
    {
        Host = uri.Host,
        Port = uri.Port,
        Username = userInfo[0],
        Password = userInfo[1],
        Database = uri.AbsolutePath.TrimStart('/'),
        SslMode = SslMode.Require,
        TrustServerCertificate = true
    };

    connectionString = npgsqlBuilder.ToString();
    Console.WriteLine($"Using Railway PostgreSQL: {uri.Host}:{uri.Port}");
}
else
{
    // Use the connection string from configuration (for local development)
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    Console.WriteLine($"Using local PostgreSQL: {connectionString}");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

// JWT settings
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));

var jwtSettings = builder.Configuration
    .GetSection("JwtSettings")
    .Get<JwtSettings>()
    ?? throw new Exception("❌ JwtSettings is missing");

// Authentication
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings.Secret)),

            ClockSkew = TimeSpan.Zero
        };
    });

// Authorization
builder.Services.AddAuthorization();

// Dependency Injection
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

/// =======================================================
/// BUILD APP
/// =======================================================
var app = builder.Build();

/// =======================================================
/// MIDDLEWARE
/// =======================================================

// Swagger (enable cả Production)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "HealthEco API v1");
    c.RoutePrefix = "swagger";
});

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

/// =======================================================
/// ROUTES
/// =======================================================

app.MapControllers();

// Health check (Railway test)
app.MapGet("/health", () =>
    Results.Ok(new
    {
        status = "Healthy",
        time = DateTime.UtcNow
    })
);

/// =======================================================
/// AUTO MIGRATION WITH RETRY POLICY
/// =======================================================
try
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    Console.WriteLine("Attempting to connect to database...");

    // Wait for database to be ready (Railway sometimes takes a moment)
    var retries = 10;
    for (int i = 0; i < retries; i++)
    {
        try
        {
            Console.WriteLine($"Migration attempt {i + 1}/{retries}");
            db.Database.Migrate();
            Console.WriteLine("✅ Database migration completed successfully");
            break;
        }
        catch (Npgsql.NpgsqlException ex) when (i < retries - 1)
        {
            Console.WriteLine($"⚠️ Database not ready yet. Retrying in 5 seconds... Error: {ex.Message}");
            Thread.Sleep(5000);
        }
    }
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Database migration failed: {ex.Message}");
    // Don't crash the app, just log the error
}

/// =======================================================
/// RUN
/// =======================================================
Console.WriteLine($"🚀 Application starting on port 8080");
app.Run();