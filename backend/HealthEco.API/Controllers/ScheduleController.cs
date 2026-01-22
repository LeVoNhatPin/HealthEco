using HealthEco.Core.DTOs.Schedule;
using HealthEco.Core.Entities;
using HealthEco.Core.Entities.Enums;
using HealthEco.Core.Enums;
using HealthEco.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthEco.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class ScheduleController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public ScheduleController(ApplicationDbContext context, ILogger<ScheduleController> logger)
            : base(logger)
        {
            _context = context;
        }

        // POST: api/schedule
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateSchedule([FromBody] DoctorScheduleRequest request)
        {
            try
            {
                var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

                if (string.IsNullOrEmpty(role) || role != "Doctor")
                {
                    return Forbid("Chỉ bác sĩ mới được tạo lịch trực");
                }


                var doctorId = await GetCurrentDoctorId();
                if (doctorId == 0) return Unauthorized(new { message = "Unauthorized" });

                // Validate time
                if (!TimeOnly.TryParse(request.StartTime, out var startTime) ||
                    !TimeOnly.TryParse(request.EndTime, out var endTime))
                {
                    return BadRequest(new { message = "Thời gian không hợp lệ" });
                }

                if (startTime >= endTime)
                {
                    return BadRequest(new { message = "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc" });
                }

                // Check if doctor works at this facility
                var doctorFacility = await _context.DoctorFacilityWorks
                    .FirstOrDefaultAsync(df => df.DoctorId == doctorId &&
                                               df.FacilityId == request.FacilityId &&
                                               df.Status == DoctorFacilityWorkStatus.Approved);

                if (doctorFacility == null)
                {
                    return BadRequest(new { message = "Bác sĩ không làm việc tại cơ sở này" });
                }

                // Check for overlapping schedules
                var existingSchedule = await _context.DoctorSchedules
                    .FirstOrDefaultAsync(s => s.DoctorId == doctorId &&
                                              s.FacilityId == request.FacilityId &&
                                              s.DayOfWeek == request.DayOfWeek &&
                                              s.IsActive);

                if (existingSchedule != null)
                {
                    return BadRequest(new { message = "Đã có lịch trực vào ngày này" });
                }

                var schedule = new DoctorSchedule
                {
                    DoctorId = doctorId,
                    FacilityId = request.FacilityId,
                    DayOfWeek = request.DayOfWeek,
                    StartTime = startTime,
                    EndTime = endTime,
                    SlotDuration = request.SlotDuration,
                    MaxPatientsPerSlot = request.MaxPatientsPerSlot,
                    ValidFrom = DateTime.Parse(request.ValidFrom),
                    ValidTo = string.IsNullOrEmpty(request.ValidTo) ? null : DateTime.Parse(request.ValidTo),
                    IsActive = true
                };

                _context.DoctorSchedules.Add(schedule);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Tạo lịch trực thành công",
                    data = MapToScheduleResponse(schedule)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating schedule");
                return StatusCode(500, new { message = "Lỗi server khi tạo lịch trực" });
            }
        }

        // GET: api/schedule/doctor/{doctorId}
        [HttpGet("doctor/{doctorId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDoctorSchedules(int doctorId, [FromQuery] bool? isActive = true)
        {
            try
            {
                var query = _context.DoctorSchedules
                    .Include(s => s.Facility)
                    .Where(s => s.DoctorId == doctorId);

                if (isActive.HasValue)
                {
                    query = query.Where(s => s.IsActive == isActive.Value);
                }

                var schedules = await query
                    .OrderBy(s => s.DayOfWeek)
                    .ThenBy(s => s.StartTime)
                    .Select(s => MapToScheduleResponse(s))
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = schedules
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting schedules for doctor {doctorId}");
                return StatusCode(500, new { message = "Lỗi server khi lấy lịch trực" });
            }
        }

        // GET: api/schedule/my-schedules
        [HttpGet("my-schedules")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetMySchedules([FromQuery] bool? isActive = true)
        {
            try
            {
                var doctorId = await GetCurrentDoctorId();
                if (doctorId == 0) return Unauthorized(new { message = "Unauthorized" });

                return await GetDoctorSchedules(doctorId, isActive);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting my schedules");
                return StatusCode(500, new { message = "Lỗi server khi lấy lịch trực" });
            }
        }

        // GET: api/schedule/available-slots
        [HttpGet("available-slots")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAvailableSlots(
            [FromQuery] int doctorId,
            [FromQuery] int facilityId,
            [FromQuery] string date)
        {
            try
            {
                if (!DateOnly.TryParse(date, out var appointmentDate))
                {
                    return BadRequest(new { message = "Ngày không hợp lệ" });
                }

                var dayOfWeek = appointmentDate.DayOfWeek;

                // Get schedule for this day
                var schedule = await _context.DoctorSchedules
                    .FirstOrDefaultAsync(s => s.DoctorId == doctorId &&
                                              s.FacilityId == facilityId &&
                                              s.DayOfWeek == dayOfWeek &&
                                              s.IsActive &&
                                              appointmentDate >= DateOnly.FromDateTime(s.ValidFrom) &&
                                              (s.ValidTo == null || appointmentDate <= DateOnly.FromDateTime(s.ValidTo.Value)));

                if (schedule == null)
                {
                    return Ok(new { success = true, data = new List<object>() });
                }

                // Generate time slots
                var slots = GenerateTimeSlots(schedule.StartTime, schedule.EndTime, schedule.SlotDuration);

                // Get existing appointments for this date
                var appointments = await _context.Appointments
                    .Where(a => a.DoctorId == doctorId &&
                                a.FacilityId == facilityId &&
                                a.AppointmentDate == appointmentDate &&
                                a.Status != AppointmentStatus.Cancelled)
                    .ToListAsync();

                // Mark available slots
                var availableSlots = slots.Select(slot => new
                {
                    startTime = slot.ToString(@"hh\:mm"),
                    endTime = slot.AddMinutes(schedule.SlotDuration).ToString(@"hh\:mm"),
                    isAvailable = appointments.Count(a => a.StartTime == slot) < schedule.MaxPatientsPerSlot
                }).ToList();

                return Ok(new
                {
                    success = true,
                    data = availableSlots
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting available slots for doctor {doctorId}");
                return StatusCode(500, new { message = "Lỗi server khi lấy slots khả dụng" });
            }
        }

        // DELETE: api/schedule/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            try
            {
                var schedule = await _context.DoctorSchedules.FindAsync(id);
                if (schedule == null)
                {
                    return NotFound(new { message = "Không tìm thấy lịch trực" });
                }

                var doctorId = await GetCurrentDoctorId();
                if (doctorId == 0 || schedule.DoctorId != doctorId)
                {
                    return Unauthorized(new { message = "Không có quyền xóa lịch trực này" });
                }

                // Check if there are future appointments
                var futureAppointments = await _context.Appointments
                    .AnyAsync(a => a.DoctorId == schedule.DoctorId &&
                                   a.FacilityId == schedule.FacilityId &&
                                   a.AppointmentDate >= DateOnly.FromDateTime(DateTime.Now) &&
                                   a.Status != AppointmentStatus.Cancelled);

                if (futureAppointments)
                {
                    // Mark as inactive instead of deleting
                    schedule.IsActive = false;
                    schedule.UpdatedAt = DateTime.UtcNow;
                    _context.DoctorSchedules.Update(schedule);
                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        success = true,
                        message = "Lịch trực đã được vô hiệu hóa (có lịch hẹn trong tương lai)"
                    });
                }

                _context.DoctorSchedules.Remove(schedule);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Xóa lịch trực thành công"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting schedule {id}");
                return StatusCode(500, new { message = "Lỗi server khi xóa lịch trực" });
            }
        }

        // Helper methods
        private async Task<int> GetCurrentDoctorId()
        {
            var userId = GetUserId();
            if (userId == 0) return 0;

            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d => d.UserId == userId);

            return doctor?.Id ?? 0;
        }

        private List<TimeOnly> GenerateTimeSlots(TimeOnly start, TimeOnly end, int slotDuration)
        {
            var slots = new List<TimeOnly>();
            var current = start;

            while (current < end)
            {
                slots.Add(current);
                current = current.AddMinutes(slotDuration);
            }

            return slots;
        }

        private object MapToScheduleResponse(DoctorSchedule schedule)
        {
            return new
            {
                schedule.Id,
                schedule.DoctorId,
                schedule.FacilityId,
                DayOfWeek = schedule.DayOfWeek.ToString(),
                StartTime = schedule.StartTime.ToString(@"hh\:mm"),
                EndTime = schedule.EndTime.ToString(@"hh\:mm"),
                schedule.SlotDuration,
                schedule.MaxPatientsPerSlot,
                schedule.IsActive,
                ValidFrom = schedule.ValidFrom.ToString("yyyy-MM-dd"),
                ValidTo = schedule.ValidTo?.ToString("yyyy-MM-dd"),
                schedule.CreatedAt
            };
        }
    }
}