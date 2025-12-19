using Serilog;
using HealthEco.API.Extensions;
using HealthEco.Application;
using HealthEco.Infrastructure;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 🚀 BẮT BUỘC CHO RENDER (EXPOSE PORT 8080)
builder.WebHost.UseUrls("http://0.0.0.0:8080");

// =======================
// CONFIGURE SERILOG
// =======================
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/health-eco-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// =======================
// ADD SERVICES
// =======================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGenWithJwt();

// Application layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// =======================
// CORS (CHO FRONTEND VERCEL)
// =======================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// =======================
// HEALTH CHECKS
// =======================
builder.Services.AddHealthChecks();

var app = builder.Build();

// =======================
// PIPELINE
// =======================
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "HealthEco API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.UseAuthorization();
app.MapControllers();

// =======================
// ENDPOINTS
// =======================
app.MapHealthChecks("/health");
app.MapGet("/", () => "HealthEco API is running! 🚀");

app.Run();
