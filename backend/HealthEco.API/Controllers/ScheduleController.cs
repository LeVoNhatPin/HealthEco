using HealthEco.Core.DTOs.Schedule;
using HealthEco.Core.Entities;
using HealthEco.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthEco.API.Controllers
{
    [ApiController]
    [Route("api/v1/schedule")]
    [Authorize(Roles = "Doctor")]
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
        // HELPER: LẤY DOCTOR TỪ JWT
        // ==============================
        private async Task<Doctor?> GetCurrentDoctor()
        {
            var userId = GetUserId();
            if (userId == 0) return null;

            return await _context.Doctors
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.UserId == userId);
        }

        // ==============================
        // GET: api/v1/schedule/my-schedules
        // ==============================
        [HttpGet("my-schedules")]
        public async Task<IActionResult> GetMySchedules()
        {
            var doctor = await GetCurrentDoctor();
            if (doctor == null)
                return Unauthorized("Doctor not found from token");

            var schedules = await _context.DoctorSchedules
                .Where(s => s.DoctorId == doctor.Id)
                .OrderBy(s => s.DayOfWeek)
                .ThenBy(s => s.StartTime)
                .ToListAsync();

            return Ok(schedules);
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
                var doctor = await GetCurrentDoctor();
                if (doctor == null)
                    return Unauthorized("Doctor not found from token");

                // ===== VALIDATION =====
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

                // ===== CREATE ENTITY =====
                var schedule = new DoctorSchedule
                {
                    DoctorId = doctor.Id,
                    FacilityId = request.FacilityId > 0 ? request.FacilityId : 1,
                    DayOfWeek = request.DayOfWeek,
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
                _logger?.LogError(ex, "CreateSchedule failed");
                return StatusCode(500, new
                {
                    error = "CREATE_SCHEDULE_FAILED",
                    detail = ex.InnerException?.Message ?? ex.Message
                });
            }
        }
    }
}
