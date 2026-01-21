using HealthEco.Core.DTOs.Appointment;
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
    [Authorize]
    public class AppointmentController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public AppointmentController(ApplicationDbContext context, ILogger<AppointmentController> logger)
            : base(logger)
        {
            _context = context;
        }

        // POST: api/appointment
        [HttpPost]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> BookAppointment([FromBody] AppointmentRequest request)
        {
            try
            {
                var patientId = GetUserId();
                if (patientId == 0) return Unauthorized(new { message = "Unauthorized" });

                // Parse date and time
                if (!DateOnly.TryParse(request.AppointmentDate, out var appointmentDate) ||
                    !TimeOnly.TryParse(request.StartTime, out var startTime))
                {
                    return BadRequest(new { message = "Ngày hoặc giờ không hợp lệ" });
                }

                // Check doctor
                var doctor = await _context.Doctors
                    .Include(d => d.User)
                    .FirstOrDefaultAsync(d => d.Id == request.DoctorId && d.IsVerified);

                if (doctor == null)
                {
                    return BadRequest(new { message = "Không tìm thấy bác sĩ" });
                }

                // Check facility
                var facility = await _context.MedicalFacilities
                    .FirstOrDefaultAsync(f => f.Id == request.FacilityId && f.IsActive);

                if (facility == null)
                {
                    return BadRequest(new { message = "Không tìm thấy cơ sở y tế" });
                }

                // Check doctor works at this facility
                var doctorFacility = await _context.DoctorFacilityWorks
                    .FirstOrDefaultAsync(df => df.DoctorId == request.DoctorId &&
                                               df.FacilityId == request.FacilityId &&
                                               df.Status == DoctorFacilityWorkStatus.Approved);

                if (doctorFacility == null)
                {
                    return BadRequest(new { message = "Bác sĩ không làm việc tại cơ sở này" });
                }

                // Check schedule availability
                var dayOfWeek = appointmentDate.DayOfWeek;
                var schedule = await _context.DoctorSchedules
                    .FirstOrDefaultAsync(s => s.DoctorId == request.DoctorId &&
                                              s.FacilityId == request.FacilityId &&
                                              s.DayOfWeek == dayOfWeek &&
                                              s.IsActive &&
                                              appointmentDate >= DateOnly.FromDateTime(s.ValidFrom) &&
                                              (s.ValidTo == null || appointmentDate <= DateOnly.FromDateTime(s.ValidTo.Value)));

                if (schedule == null)
                {
                    return BadRequest(new { message = "Bác sĩ không có lịch trực vào ngày này" });
                }

                // Check if time is within working hours
                if (startTime < schedule.StartTime || startTime >= schedule.EndTime)
                {
                    return BadRequest(new { message = "Thời gian không nằm trong khung giờ làm việc" });
                }

                // Check if slot is full
                var existingAppointments = await _context.Appointments
                    .CountAsync(a => a.DoctorId == request.DoctorId &&
                                     a.FacilityId == request.FacilityId &&
                                     a.AppointmentDate == appointmentDate &&
                                     a.StartTime == startTime &&
                                     a.Status != AppointmentStatus.Cancelled);

                if (existingAppointments >= schedule.MaxPatientsPerSlot)
                {
                    return BadRequest(new { message = "Slot này đã đầy, vui lòng chọn slot khác" });
                }

                // Generate appointment code
                var appointmentCode = $"APT-{DateTime.Now:yyyyMMddHHmmss}-{patientId:00000}";

                var appointment = new Appointment
                {
                    AppointmentCode = appointmentCode,
                    PatientId = patientId,
                    DoctorId = request.DoctorId,
                    FacilityId = request.FacilityId,
                    AppointmentDate = appointmentDate,
                    StartTime = startTime,
                    EndTime = startTime.AddMinutes(schedule.SlotDuration),
                    AppointmentType = "IN_CLINIC",
                    Status = AppointmentStatus.Pending,
                    Symptoms = request.Symptoms ?? string.Empty,
                    ConsultationFee = doctor.ConsultationFee,
                    TotalAmount = doctor.ConsultationFee,
                    PaymentStatus = PaymentStatus.Pending,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Đặt lịch thành công",
                    data = new
                    {
                        appointment.Id,
                        appointment.AppointmentCode,
                        appointment.PatientId,
                        appointment.DoctorId,
                        appointment.FacilityId,
                        AppointmentDate = appointment.AppointmentDate.ToString("yyyy-MM-dd"),
                        StartTime = appointment.StartTime.ToString(@"hh\:mm"),
                        EndTime = appointment.EndTime.ToString(@"hh\:mm"),
                        Status = appointment.Status.ToString(),
                        appointment.Symptoms,
                        appointment.ConsultationFee
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error booking appointment");
                return StatusCode(500, new { message = "Lỗi server khi đặt lịch" });
            }
        }

        // GET: api/appointment/my-appointments
        [HttpGet("my-appointments")]
        public async Task<IActionResult> GetMyAppointments([FromQuery] string? status = null)
        {
            try
            {
                var userId = GetUserId();
                if (userId == 0) return Unauthorized(new { message = "Unauthorized" });

                var user = await _context.Users.FindAsync(userId);
                if (user == null) return Unauthorized(new { message = "Unauthorized" });

                IQueryable<Appointment> query;

                if (user.Role == UserRole.Patient)
                {
                    query = _context.Appointments
                        .Include(a => a.Doctor)
                        .ThenInclude(d => d.User)
                        .Include(a => a.Facility)
                        .Where(a => a.PatientId == userId);
                }
                else if (user.Role == UserRole.Doctor)
                {
                    var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
                    if (doctor == null) return Unauthorized(new { message = "Unauthorized" });

                    query = _context.Appointments
                        .Include(a => a.Patient)
                        .Include(a => a.Facility)
                        .Where(a => a.DoctorId == doctor.Id);
                }
                else
                {
                    return Unauthorized(new { message = "Unauthorized" });
                }

                // Filter by status
                if (!string.IsNullOrEmpty(status) && Enum.TryParse<AppointmentStatus>(status, true, out var statusEnum))
                {
                    query = query.Where(a => a.Status == statusEnum);
                }

                // Sort by date and time
                query = query.OrderByDescending(a => a.AppointmentDate)
                            .ThenByDescending(a => a.StartTime);

                var appointments = await query
                    .Select(a => new
                    {
                        a.Id,
                        a.AppointmentCode,
                        a.PatientId,
                        a.DoctorId,
                        a.FacilityId,
                        PatientName = a.Patient.FullName,
                        DoctorName = a.Doctor.User.FullName,
                        FacilityName = a.Facility.Name,
                        AppointmentDate = a.AppointmentDate.ToString("yyyy-MM-dd"),
                        StartTime = a.StartTime.ToString(@"hh\:mm"),
                        EndTime = a.EndTime.ToString(@"hh\:mm"),
                        a.AppointmentType,
                        Status = a.Status.ToString(),
                        a.Symptoms,
                        a.ConsultationFee,
                        a.TotalAmount,
                        PaymentStatus = a.PaymentStatus.ToString(),
                        a.CreatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = appointments
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting appointments");
                return StatusCode(500, new { message = "Lỗi server khi lấy lịch hẹn" });
            }
        }

        // PUT: api/appointment/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateAppointmentStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null)
                {
                    return NotFound(new { message = "Không tìm thấy lịch hẹn" });
                }

                var userId = GetUserId();
                var user = await _context.Users.FindAsync(userId);

                // Check permission
                bool hasPermission = false;

                if (user.Role == UserRole.Doctor)
                {
                    var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
                    hasPermission = doctor != null && appointment.DoctorId == doctor.Id;
                }
                else if (user.Role == UserRole.Patient)
                {
                    hasPermission = appointment.PatientId == userId;
                }
                else if (user.Role == UserRole.SystemAdmin)
                {
                    hasPermission = true;
                }

                if (!hasPermission)
                {
                    return Unauthorized(new { message = "Không có quyền cập nhật lịch hẹn này" });
                }

                // Update status
                if (Enum.TryParse<AppointmentStatus>(request.Status, true, out var status))
                {
                    appointment.Status = status;
                    appointment.UpdatedAt = DateTime.UtcNow;

                    _context.Appointments.Update(appointment);
                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        success = true,
                        message = "Cập nhật trạng thái thành công"
                    });
                }

                return BadRequest(new { message = "Trạng thái không hợp lệ" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating appointment status {id}");
                return StatusCode(500, new { message = "Lỗi server khi cập nhật trạng thái" });
            }
        }

        // DELETE: api/appointment/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null)
                {
                    return NotFound(new { message = "Không tìm thấy lịch hẹn" });
                }

                var userId = GetUserId();
                if (appointment.PatientId != userId)
                {
                    return Unauthorized(new { message = "Không có quyền hủy lịch hẹn này" });
                }

                // Only allow cancellation if appointment is in PENDING status
                if (appointment.Status != AppointmentStatus.Pending)
                {
                    return BadRequest(new { message = "Chỉ có thể hủy lịch hẹn đang chờ xác nhận" });
                }

                // Check cancellation time (at least 24 hours before)
                var appointmentDateTime = appointment.AppointmentDate.ToDateTime(appointment.StartTime);
                if (appointmentDateTime < DateTime.Now.AddHours(24))
                {
                    return BadRequest(new { message = "Chỉ có thể hủy lịch trước 24 giờ" });
                }

                appointment.Status = AppointmentStatus.Cancelled;
                appointment.UpdatedAt = DateTime.UtcNow;

                _context.Appointments.Update(appointment);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Hủy lịch hẹn thành công"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error canceling appointment {id}");
                return StatusCode(500, new { message = "Lỗi server khi hủy lịch hẹn" });
            }
        }

        // GET: api/appointment/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointment(int id)
        {
            try
            {
                var appointment = await _context.Appointments
                    .Include(a => a.Patient)
                    .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                    .Include(a => a.Facility)
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (appointment == null)
                {
                    return NotFound(new { message = "Không tìm thấy lịch hẹn" });
                }

                // Check permission to view
                var userId = GetUserId();
                var user = await _context.Users.FindAsync(userId);

                bool hasPermission = false;

                if (user.Role == UserRole.Patient)
                    hasPermission = appointment.PatientId == userId;
                else if (user.Role == UserRole.Doctor)
                {
                    var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
                    hasPermission = doctor != null && appointment.DoctorId == doctor.Id;
                }
                else if (user.Role == UserRole.SystemAdmin)
                    hasPermission = true;

                if (!hasPermission)
                {
                    return Unauthorized(new { message = "Không có quyền xem lịch hẹn này" });
                }

                var response = new
                {
                    appointment.Id,
                    appointment.AppointmentCode,
                    appointment.PatientId,
                    PatientName = appointment.Patient.FullName,
                    appointment.DoctorId,
                    DoctorName = appointment.Doctor.User.FullName,
                    appointment.FacilityId,
                    FacilityName = appointment.Facility.Name,
                    AppointmentDate = appointment.AppointmentDate.ToString("yyyy-MM-dd"),
                    StartTime = appointment.StartTime.ToString(@"hh\:mm"),
                    EndTime = appointment.EndTime.ToString(@"hh\:mm"),
                    appointment.AppointmentType,
                    Status = appointment.Status.ToString(),
                    appointment.Symptoms,
                    appointment.ConsultationFee,
                    appointment.TotalAmount,
                    PaymentStatus = appointment.PaymentStatus.ToString(),
                    appointment.CreatedAt
                };

                return Ok(new
                {
                    success = true,
                    data = response
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting appointment {id}");
                return StatusCode(500, new { message = "Lỗi server khi lấy chi tiết lịch hẹn" });
            }
        }
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; } = null!;
    }
}