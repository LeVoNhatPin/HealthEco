// HealthEco.API/Controllers/ScheduleController.cs
using HealthEco.Core.DTOs.Schedule;
using HealthEco.Core.Entities;
using HealthEco.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthEco.Core.DTOs.Schedule;

namespace HealthEco.API.Controllers
{
    [ApiController]
    [Route("api/v1/schedule")]
    [AllowAnonymous] // ✅ BẮT BUỘC
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

            var schedules = await _context.DoctorSchedule
                .Where(s => s.DoctorId == doctor.Id)
                .OrderBy(s => s.DayOfWeek)
                .ThenBy(s => s.StartTime)
                .AsNoTracking()
                .ToListAsync();

            return Ok(schedules);
        }

        [HttpGet("doctor/{doctorId}/slots")]
        public async Task<IActionResult> GetDoctorAvailableSlots(
            int doctorId,
            [FromQuery] DateTime date
        )
        {
            int dayOfWeek = (int)date.DayOfWeek;
            if (dayOfWeek == 0) dayOfWeek = 7;

            var schedules = await _context.DoctorSchedule
                .Where(s =>
                    s.DoctorId == doctorId &&
                    s.DayOfWeek == dayOfWeek &&
                    s.IsActive &&
                    s.ValidFrom.Date <= date.Date &&
                    (s.ValidTo == null || s.ValidTo.Value.Date >= date.Date)
                )
                .AsNoTracking()
                .ToListAsync();

            var slots = new List<DoctorSlotDto>();

            foreach (var schedule in schedules)
            {
                var current = schedule.StartTime;
                var duration = TimeSpan.FromMinutes(schedule.SlotDuration);

                while (current + duration <= schedule.EndTime)
                {
                    var slotEnd = current + duration;

                    // 🔥 ĐẾM SỐ LƯỢNG APPOINTMENT ĐÃ ĐẶT SLOT NÀY
                    var bookedCount = await _context.Appointments.CountAsync(a =>
                        a.DoctorId == doctorId &&
                        a.AppointmentDate == DateOnly.FromDateTime(date) &&
                        a.StartTime == TimeOnly.FromTimeSpan(current)
                    );

                    slots.Add(new DoctorSlotDto
                    {
                        Date = date.Date,
                        StartTime = current,
                        EndTime = slotEnd,
                        IsAvailable = bookedCount < schedule.MaxPatientsPerSlot
                    });

                    current = slotEnd;
                }
            }

            return Ok(slots);
        }



        // ==============================
        // GET: api/v1/schedule/available-slots
        // ==============================
        [HttpGet("available-slots")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAvailableSlots(
            [FromQuery] int doctorId,
            [FromQuery] int facilityId,
            [FromQuery] string date // yyyy-MM-dd
        )
        {
            // 1️⃣ Parse ngày
            if (!DateOnly.TryParse(date, out var selectedDate))
                return BadRequest("Invalid date format. Use yyyy-MM-dd");

            // 2️⃣ Convert sang DateTime UTC (00:00)
            var selectedDateTimeUtc = DateTime.SpecifyKind(
                selectedDate.ToDateTime(TimeOnly.MinValue),
                DateTimeKind.Utc
            );

            // 3️⃣ Lấy thứ trong tuần (0–6, Chủ nhật = 0)
            var dayOfWeek = (int)selectedDate.DayOfWeek;

            // 4️⃣ Lấy lịch trực hợp lệ
            var schedules = await _context.DoctorSchedule
                .Where(s =>
                    s.DoctorId == doctorId &&
                    s.DayOfWeek == dayOfWeek &&
                    s.IsActive &&
                    s.ValidFrom <= selectedDateTimeUtc &&
                    (s.ValidTo == null || s.ValidTo >= selectedDateTimeUtc)
                )
                .AsNoTracking()
                .ToListAsync();

            var result = new List<AvailableSlotResponse>();

            // 5️⃣ Sinh slot theo SlotDuration
            foreach (var schedule in schedules)
            {
                var slotStart = schedule.StartTime;
                var slotDuration = TimeSpan.FromMinutes(schedule.SlotDuration);

                while (slotStart + slotDuration <= schedule.EndTime)
                {
                    var slotEnd = slotStart + slotDuration;

                    // 6️⃣ Đếm số lịch đã đặt trong slot này
                    var bookedCount = await _context.Appointments.CountAsync(a =>
                        a.DoctorId == doctorId &&
                        a.AppointmentDate == selectedDate &&
                        a.StartTime == TimeOnly.FromTimeSpan(slotStart)
                    );

                    result.Add(new AvailableSlotResponse
                    {
                        StartTime = slotStart.ToString(@"hh\:mm"),
                        EndTime = slotEnd.ToString(@"hh\:mm"),
                        IsAvailable = bookedCount < schedule.MaxPatientsPerSlot
                    });

                    slotStart = slotEnd;
                }
            }

            return Ok(result);
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

                ValidFrom = DateTime.SpecifyKind(validFrom, DateTimeKind.Utc),
                ValidTo = validTo.HasValue
         ? DateTime.SpecifyKind(validTo.Value, DateTimeKind.Utc)
         : null,

                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };


            _context.DoctorSchedule.Add(schedule);
            await _context.SaveChangesAsync();

            return Ok(schedule);
        }

        [HttpGet("doctor/{doctorId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDoctorSchedules(int doctorId)
        {
            var schedules = await _context.DoctorSchedule
                .Where(s => s.DoctorId == doctorId && s.IsActive)
                .AsNoTracking()
                .ToListAsync();

            return Ok(schedules);
        }



        // ==============================
        // DELETE: api/v1/schedule/{id}
        // ==============================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            var doctor = await GetCurrentDoctor();
            if (doctor == null)
                return Unauthorized("Doctor not found from token");

            var schedule = await _context.DoctorSchedule
                .FirstOrDefaultAsync(s => s.Id == id && s.DoctorId == doctor.Id);

            if (schedule == null)
                return NotFound("Schedule not found");

            _context.DoctorSchedule.Remove(schedule);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Schedule deleted successfully" });
        }

    }
}
