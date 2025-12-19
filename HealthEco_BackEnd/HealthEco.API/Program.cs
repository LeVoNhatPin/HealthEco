using Serilog;
using HealthEco.API.Extensions;
using HealthEco.Application;
using HealthEco.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/health-eco-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGenWithJwt();

// Add layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add Health Checks
builder.Services.AddHealthChecks();

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "HealthEco API v1");
        c.RoutePrefix = "swagger";
    });
}

// MIDDLEWARE PIPELINE - PHẢI ĐẶT TRƯỚC KHI MAP ENDPOINTS
app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();

// MAP ENDPOINTS
app.MapControllers();
app.MapHealthChecks("/health");
app.MapGet("/", () => "HealthEco API is running!");

// CUỐI CÙNG: ĐỌC PORT VÀ CHẠY APP
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Run($"http://0.0.0.0:{port}");