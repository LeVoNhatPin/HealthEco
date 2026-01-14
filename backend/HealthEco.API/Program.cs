using System.Text;
using HealthEco.Core.Configuration;
using HealthEco.Infrastructure.Data;
using HealthEco.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

#region CONFIGURATION

var configuration = builder.Configuration;
var environment = builder.Environment;

#endregion

#region CORS (FIXED – SINGLE POLICY)

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "https://health-eco.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

#endregion

#region SERVICES

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
    logging.AddDebug();
    logging.SetMinimumLevel(LogLevel.Information);
});

#endregion

#region SWAGGER

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "HealthEco API",
        Version = "v1"
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

#endregion

#region JWT AUTH

builder.Services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));
var jwtSettings = configuration.GetSection("JwtSettings");

// THÊM log để debug JWT settings
var logger = LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger<Program>();

var jwtSecret = jwtSettings["Secret"];
if (string.IsNullOrEmpty(jwtSecret))
{
    logger.LogError("JWT Secret is missing! Check appsettings.json");
    throw new InvalidOperationException("JWT Secret is missing");
}
else
{
    logger.LogInformation($"JWT Secret loaded. Length: {jwtSecret.Length}");
    logger.LogInformation($"JWT Issuer: {jwtSettings["Issuer"]}");
    logger.LogInformation($"JWT Audience: {jwtSettings["Audience"]}");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false; // Đổi thành false cho development
        options.SaveToken = true;

        // THÊM logging cho JWT
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                logger.LogError($"Authentication failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                logger.LogInformation("Token validated successfully");
                return Task.CompletedTask;
            }
        };

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSecret)
            ),

            ClockSkew = TimeSpan.Zero // Không có độ trễ
        };
    });

builder.Services.AddAuthorization();

#endregion

#region APPLICATION SERVICES

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddTransient<SeedData>();
builder.Services.AddDistributedMemoryCache();

#endregion

#region DATABASE (RAILWAY POSTGRES – FIXED)

string connectionString;

var railwayDbUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
var defaultConn = configuration.GetConnectionString("DefaultConnection");

if (!string.IsNullOrEmpty(railwayDbUrl))
{
    var uri = new Uri(railwayDbUrl.Replace("postgres://", "postgresql://"));
    var userInfo = uri.UserInfo.Split(':');

    connectionString =
        $"Host={uri.Host};" +
        $"Port={(uri.Port > 0 ? uri.Port : 5432)};" +
        $"Database={uri.LocalPath.TrimStart('/')};" +
        $"Username={userInfo[0]};" +
        $"Password={userInfo[1]};" +
        $"SSL Mode=Require;" +
        $"Trust Server Certificate=true;";
}
else if (!string.IsNullOrEmpty(defaultConn))
{
    connectionString = defaultConn;
}
else
{
    throw new Exception("❌ No database connection string found.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(connectionString, npgsql =>
    {
        npgsql.EnableRetryOnFailure(5, TimeSpan.FromSeconds(30), null);
    });

    if (environment.IsDevelopment())
    {
        options.EnableDetailedErrors();
        options.EnableSensitiveDataLogging();
    }
});

#endregion

var app = builder.Build();

#region MIDDLEWARE (ORDER IS IMPORTANT)

if (environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "HealthEco API V1");
});

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

#endregion

#region AUTO MIGRATION + SEED (SAFE)

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var seeder = scope.ServiceProvider.GetRequiredService<SeedData>();
    var migrationLogger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        migrationLogger.LogInformation("🔄 Applying migrations...");
        await context.Database.MigrateAsync();

        migrationLogger.LogInformation("🌱 Seeding data...");
        await seeder.InitializeAsync(context);

        migrationLogger.LogInformation("✅ Database ready");
    }
    catch (Exception ex)
    {
        migrationLogger.LogError(ex, "❌ Database init failed");
    }
}

#endregion

#region GLOBAL EXCEPTION HANDLING

app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        var exceptionHandlerPathFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();

        if (exceptionHandlerPathFeature?.Error != null)
        {
            var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
            logger.LogError(exceptionHandlerPathFeature.Error, "Unhandled exception");

            var errorResponse = new
            {
                Success = false,
                Message = "An internal server error occurred",
                Error = exceptionHandlerPathFeature.Error.Message,
                Path = exceptionHandlerPathFeature.Path,
                Timestamp = DateTime.UtcNow
            };

            await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(errorResponse));
        }
    });
});

// Bật detailed errors
app.UseDeveloperExceptionPage();

#endregion

app.Run();
