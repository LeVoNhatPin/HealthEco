using HealthEco.Core.Interfaces;
using HealthEco.Infrastructure.Data;
using HealthEco.Infrastructure.Identity;
using HealthEco.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

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

    // JWT support
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


/// =======================================================
/// DATABASE (RAILWAY DATABASE_URL + LOCAL FALLBACK)
/// =======================================================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var databaseUrl = builder.Configuration["DATABASE_URL"];
    string connectionString;

    if (!string.IsNullOrWhiteSpace(databaseUrl))
    {
        // Parse postgresql://user:pass@host:port/db
        var uri = new Uri(databaseUrl);
        var userInfo = uri.UserInfo.Split(':', 2);

        var username = userInfo[0];
        var password = userInfo[1];

        connectionString =
            $"Host={uri.Host};" +
            $"Port={uri.Port};" +
            $"Database={uri.AbsolutePath.Trim('/')};" +
            $"Username={username};" +
            $"Password={password};" +
            $"SSL Mode=Require;" +
            $"Trust Server Certificate=true;";
    }
    else
    {
        connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
            ?? throw new Exception("❌ No database connection string found");
    }

    options.UseNpgsql(connectionString);
});


/// =======================================================
/// JWT
/// =======================================================
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


/// =======================================================
/// DEPENDENCY INJECTION
/// =======================================================
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();


/// =======================================================
/// BUILD APP
/// =======================================================
var app = builder.Build();


/// =======================================================
/// MIDDLEWARE
/// =======================================================

// Swagger (enable cả production)
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

// Health check
app.MapGet("/health", () =>
    Results.Ok(new
    {
        status = "Healthy",
        time = DateTime.UtcNow
    })
);


/// =======================================================
/// AUTO MIGRATION (PRODUCTION)
/// =======================================================
if (!app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}


/// =======================================================
/// RUN
/// =======================================================
app.Run();
