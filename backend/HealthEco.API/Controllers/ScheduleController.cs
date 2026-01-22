// HealthEco.API/Controllers/ScheduleController.cs
using HealthEco.Core.DTOs.Schedule;
using HealthEco.Core.Entities;
using HealthEco.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HealthEco.API.Controllers
{
    [ApiController]
    [Route("api/schedule")]
    [Authorize(Roles = "Doctor")]
    public class ScheduleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ScheduleController> _logger;

        public ScheduleController(ApplicationDbContext context, ILogger<ScheduleController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET api/schedule/my-schedules
        [HttpGet("my-schedules")]
        public async Task<IActionResult> GetMySchedules()
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

                var doctor = await _context.Doctors
                    .FirstOrDefaultAsync(d => d.UserId == userId);

                if (doctor == null)
                    return BadRequest("Doctor not found");

                var schedules = await _context.DoctorSchedules
                    .Where(s => s.DoctorId == doctor.Id)
                    .ToListAsync();

                return Ok(schedules);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetMySchedules failed");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST api/schedule
        [HttpPost]
        public async Task<IActionResult> CreateSchedule([FromBody] DoctorScheduleRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

                var doctor = await _context.Doctors
                    .FirstOrDefaultAsync(d => d.UserId == userId);

                if (doctor == null)
                    return BadRequest("Doctor not found");

                if (!TimeSpan.TryParse(request.StartTime, out var start))
                    return BadRequest("Invalid StartTime");

                if (!TimeSpan.TryParse(request.EndTime, out var end))
                    return BadRequest("Invalid EndTime");

                if (!DateTime.TryParse(request.ValidFrom, out var validFrom))
                    return BadRequest("Invalid ValidFrom");

                DateTime? validTo = null;
                if (!string.IsNullOrEmpty(request.ValidTo))
                {
                    if (!DateTime.TryParse(request.ValidTo, out var parsedValidTo))
                        return BadRequest("Invalid ValidTo");

                    validTo = parsedValidTo;
                }

                var schedule = new DoctorSchedule
                {
                    DoctorId = doctor.Id,
                    FacilityId = null, // ✅ KHÔNG DÙNG FACILITY
                    DayOfWeek = (int)request.DayOfWeek,
                    StartTime = start,
                    EndTime = end,
                    SlotDuration = request.SlotDuration,
                    MaxPatientsPerSlot = request.MaxPatientsPerSlot,
                    ValidFrom = validFrom,
                    ValidTo = validTo,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.DoctorSchedules.Add(schedule);
                await _context.SaveChangesAsync();

                return Ok(schedule);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CreateSchedule failed");
                return StatusCode(500, new
                {
                    error = "CREATE_SCHEDULE_FAILED",
                    detail = ex.InnerException?.Message ?? ex.Message
                });
            }
        }
    }
}
