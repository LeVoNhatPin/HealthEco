using HealthEco.Core.DTOs.Schedule;
using HealthEco.Core.Entities;
using HealthEco.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthEco.API.Controllers
{
    [ApiController]
    [Route("api/v1/schedule")]
    // ❌ BỎ AUTHORIZE
    public class ScheduleController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public ScheduleController(
            ApplicationDbContext context,
            ILogger<ScheduleController> logger
        ) : base(logger)
        {
            _context = context;
        }

        // ==============================
        // GET ALL SCHEDULES (TEST)
        // ==============================
        [HttpGet]
        public async Task<IActionResult> GetAllSchedules()
        {
            try
            {
                var schedules = await _context.DoctorSchedules
                    .OrderBy(s => s.DayOfWeek)
                    .ThenBy(s => s.StartTime)
                    .ToListAsync();

                return Ok(schedules);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetAllSchedules failed");
                return StatusCode(500, "Internal server error");
            }
        }

        // ==============================
        // POST: api/v1/schedule
        // ==============================
        [HttpPost]
        public async Task<IActionResult> CreateSchedule(
            [FromBody] DoctorScheduleRequest request)
        {
            try
            {
                // ❗ HARD-CODE DoctorId để test
                const int TEST_DOCTOR_ID = 1;

                if (!TimeSpan.TryParse(request.StartTime, out var start))
                    return BadRequest("Invalid StartTime");

                if (!TimeSpan.TryParse(request.EndTime, out var end))
                    return BadRequest("Invalid EndTime");

                if (end <= start)
                    return BadRequest("EndTime must be after StartTime");

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
                    DoctorId = TEST_DOCTOR_ID, // 👈 FIX CỨNG
                    FacilityId = request.FacilityId > 0 ? request.FacilityId : 1,
                    DayOfWeek = (int)request.DayOfWeek,
                    StartTime = start,
                    EndTime = end,
                    SlotDuration = request.SlotDuration,
                    MaxPatientsPerSlot = request.MaxPatientsPerSlot,
                    ValidFrom = DateTime.UtcNow,
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
