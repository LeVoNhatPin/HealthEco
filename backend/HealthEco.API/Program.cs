using HealthEco.Core.Configuration;
using HealthEco.Infrastructure.Data;
using HealthEco.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

#region CONFIGURATION

var configuration = builder.Configuration;
var environment = builder.Environment;

#endregion

#region CORS (IMPROVED)

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "https://localhost:3000",
                "https://health-eco.vercel.app",
                "https://*.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetPreflightMaxAge(TimeSpan.FromSeconds(86400));
    });
});

#endregion

#region SERVICES

// Thêm HttpContextAccessor
builder.Services.AddHttpContextAccessor();

// Thêm Memory Cache
builder.Services.AddMemoryCache();

// Cấu hình Controllers với JSON options
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;

        // Xử lý DateOnly
        options.JsonSerializerOptions.Converters.Add(new DateOnlyJsonConverter());
    });

builder.Services.AddEndpointsApiExplorer();

// Cấu hình logging
builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
    logging.AddDebug();
    logging.SetMinimumLevel(LogLevel.Information);
});

#endregion

#region SWAGGER (IMPROVED)

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "HealthEco API",
        Version = "v1",
        Description = "API for HealthEco Platform",
        Contact = new OpenApiContact
        {
            Name = "HealthEco Team",
            Email = "support@healtheco.com"
        }
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
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
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });

    // Thêm hỗ trợ cho DateOnly
    c.MapType<DateOnly>(() => new OpenApiSchema
    {
        Type = "string",
        Format = "date"
    });

    // Include XML comments (nếu có)
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

#endregion

#region JWT AUTH (FIXED)

builder.Services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));
var jwtSettings = configuration.GetSection("JwtSettings");

// Lấy secret key
var jwtSecret = jwtSettings["Secret"];
if (string.IsNullOrEmpty(jwtSecret))
{
    throw new InvalidOperationException("JWT Secret is missing! Check appsettings.json or environment variables.");
}

// Cấu hình Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = environment.IsProduction();
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "HealthEco.API",
        ValidAudience = jwtSettings["Audience"] ?? "HealthEco.Client",
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSecret)
        ),
        ClockSkew = TimeSpan.Zero
    };

    // Logging events
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
            logger.LogError($"Authentication failed: {context.Exception.Message}");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
            logger.LogInformation("Token validated successfully");
            return Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
            logger.LogWarning($"Authentication challenge: {context.Error}");
            return Task.CompletedTask;
        }
    };
});

// Cấu hình Authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("SystemAdmin", "ClinicAdmin"));

    options.AddPolicy("DoctorOnly", policy =>
        policy.RequireRole("Doctor"));

    options.AddPolicy("PatientOnly", policy =>
        policy.RequireRole("Patient"));

    options.AddPolicy("ClinicStaff", policy =>
        policy.RequireRole("Doctor", "ClinicAdmin", "Staff"));

    options.AddPolicy("VerifiedDoctor", policy =>
        policy.RequireRole("Doctor")
              .RequireClaim("IsVerified", "true"));
});

#endregion

#region APPLICATION SERVICES

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IDoctorService, DoctorService>(); // Thêm nếu có
builder.Services.AddTransient<SeedData>();
builder.Services.AddDistributedMemoryCache();

#endregion

#region DATABASE (RAILWAY POSTGRES – IMPROVED)

string connectionString;

var railwayDbUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
var defaultConn = configuration.GetConnectionString("DefaultConnection");

if (!string.IsNullOrEmpty(railwayDbUrl))
{
    // Parse Railway PostgreSQL URL
    var uri = new Uri(railwayDbUrl);
    var userInfo = uri.UserInfo.Split(':');

    connectionString = new Npgsql.NpgsqlConnectionStringBuilder
    {
        Host = uri.Host,
        Port = uri.Port > 0 ? uri.Port : 5432,
        Database = uri.AbsolutePath.TrimStart('/'),
        Username = userInfo[0],
        Password = userInfo[1],
        SslMode = Npgsql.SslMode.Require,
        TrustServerCertificate = true,
        Pooling = true,
        MaxPoolSize = 100,
        ConnectionIdleLifetime = 300
    }.ConnectionString;
}
else if (!string.IsNullOrEmpty(defaultConn))
{
    connectionString = defaultConn;
}
else
{
    throw new Exception("❌ No database connection string found. Check DATABASE_URL or ConnectionStrings:DefaultConnection");
}

builder.Services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
{
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorCodesToAdd: null);

        npgsqlOptions.MigrationsAssembly("HealthEco.Infrastructure");
    });

    if (environment.IsDevelopment())
    {
        options.EnableDetailedErrors();
        options.EnableSensitiveDataLogging();
        options.LogTo(Console.WriteLine, LogLevel.Information);
    }
});

#endregion

#region HEALTH CHECKS

builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>("Database")
    .AddUrlGroup(new Uri("http://localhost:5000/api/health"), "API Health");

#endregion

var app = builder.Build();

#region MIDDLEWARE (CORRECT ORDER)

// Exception handling đầu tiên
app.UseExceptionHandler("/error");

if (environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "HealthEco API V1");
        c.RoutePrefix = "swagger";
        c.DisplayRequestDuration();
        c.EnableDeepLinking();
        c.EnableTryItOutByDefault();
    });
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();

// CORS phải ở sau UseHttpsRedirection và trước UseAuthentication
app.UseCors("AllowFrontend");

// Static files (nếu cần)
app.UseStaticFiles();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Health check endpoint
app.MapHealthChecks("/health");
app.MapHealthChecks("/api/health");

// Controllers
app.MapControllers();

#endregion

#region AUTO MIGRATION + SEED (SAFE)

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var context = services.GetRequiredService<ApplicationDbContext>();
    var seeder = services.GetRequiredService<SeedData>();

    try
    {
        logger.LogInformation("🔄 Applying database migrations...");
        await context.Database.MigrateAsync();

        logger.LogInformation("🌱 Seeding database...");
        await seeder.InitializeAsync(context);

        logger.LogInformation("✅ Database initialization completed");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "❌ Database initialization failed");
        throw;
    }
}

#endregion

#region GLOBAL EXCEPTION HANDLING (ENHANCED)

app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        var exceptionHandlerPathFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();

        if (exceptionHandlerPathFeature?.Error != null)
        {
            logger.LogError(exceptionHandlerPathFeature.Error,
                "Unhandled exception at {Path}",
                exceptionHandlerPathFeature.Path);

            var errorResponse = new
            {
                Success = false,
                Message = "An internal server error occurred",
                Error = environment.IsDevelopment() ? exceptionHandlerPathFeature.Error.Message : "Internal server error",
                Path = exceptionHandlerPathFeature.Path,
                Timestamp = DateTime.UtcNow
            };

            await context.Response.WriteAsJsonAsync(errorResponse);
        }
    });
});

// Thêm middleware logging
app.Use(async (context, next) =>
{
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    logger.LogInformation($"Request: {context.Request.Method} {context.Request.Path}");
    await next();
    logger.LogInformation($"Response: {context.Response.StatusCode} for {context.Request.Path}");
});

#endregion

app.Run();

#region ADDITIONAL CLASSES

// Converter cho DateOnly
public class DateOnlyJsonConverter : JsonConverter<DateOnly>
{
    private const string Format = "yyyy-MM-dd";

    public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return DateOnly.Parse(reader.GetString());
    }

    public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString(Format));
    }
}

#endregion