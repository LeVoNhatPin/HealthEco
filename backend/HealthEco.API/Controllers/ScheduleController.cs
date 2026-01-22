// HealthEco.API/Controllers/ScheduleController.cs
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
    [Authorize] // ✅ BẮT BUỘC
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
        // LẤY DOCTOR TỪ JWT
        // ==============================
        private async Task<Doctor?> GetCurrentDoctor()
        {
            var userId = GetUserId(); // từ BaseController

            if (userId <= 0)
                return null;

            return await _context.Doctors
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
                .AsNoTracking()
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
            var doctor = await GetCurrentDoctor();
            if (doctor == null)
                return Unauthorized("Doctor not found from token");

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
                DoctorId = doctor.Id,
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
    }
}
