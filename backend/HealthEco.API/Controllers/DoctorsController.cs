// HealthEco.API/Controllers/DoctorsController.cs
using HealthEco.Core.DTOs;
using HealthEco.Core.DTOs.Doctor;
using HealthEco.Core.Entities;
using HealthEco.Core.Entities.Enums;
using HealthEco.Core.Enums;
using HealthEco.Infrastructure.Data;
using HealthEco.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace HealthEco.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : BaseController
    {
        private readonly ApplicationDbContext _context;
        private readonly IAuthService _authService;

        // Sửa constructor - nhận ILogger<DoctorsController> thay vì ILogger<BaseController>
        public DoctorsController(
            ApplicationDbContext context,
            IAuthService authService,
            ILogger<DoctorsController> logger) : base(logger)
        {
            _context = context;
            _authService = authService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(DoctorRegisterRequest request)
        {
            var strategy = _context.Database.CreateExecutionStrategy();

            return await strategy.ExecuteAsync<IActionResult>(async () =>
            {
                await using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    if (await _context.Users.AnyAsync(x => x.Email == request.Email))
                        return BadRequest("Email đã tồn tại");

                    if (await _context.Doctors.AnyAsync(x => x.MedicalLicense == request.MedicalLicense))
                        return BadRequest("Giấy phép hành nghề đã tồn tại");

                    var user = new User
                    {
                        Email = request.Email,
                        PasswordHash = _authService.HashPassword(request.Password),
                        FullName = request.FullName,
                        PhoneNumber = request.PhoneNumber,
                        DateOfBirth = request.DateOfBirth.HasValue
                            ? DateOnly.FromDateTime(request.DateOfBirth.Value)
                            : null,
                        Address = request.Address,
                        City = request.City,
                        Role = UserRole.Doctor
                    };

                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();

                    var doctor = new Doctor
                    {
                        UserId = user.Id,
                        MedicalLicense = request.MedicalLicense,
                        LicenseImageUrl = request.LicenseImageUrl,
                        SpecializationId = request.SpecializationId,
                        YearsExperience = request.YearsExperience,
                        Qualifications = request.Qualifications,
                        Bio = request.Bio,
                        ConsultationFee = request.ConsultationFee,

                        Rating = 0,
                        TotalReviews = 0,
                        IsVerified = false
                    };

                    _context.Doctors.Add(doctor);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    return Ok(new
                    {
                        message = "Đăng ký bác sĩ thành công, chờ xác minh"
                    });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Error registering doctor");
                    return StatusCode(500, new { message = "Lỗi server khi đăng ký bác sĩ" });
                }

            });
        }



        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetDoctors([FromQuery] DoctorSearchRequest request)
        {
            try
            {
                var query = _context.Doctors
                    .Include(d => d.User)
                    .Include(d => d.Specialization)
                    .Where(d => d.User.IsActive && d.IsVerified)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(request.SearchTerm))
                {
                    query = query.Where(d =>
                        d.User.FullName.Contains(request.SearchTerm) ||
                        d.User.City.Contains(request.SearchTerm) ||
                        (d.Specialization != null && d.Specialization.Name.Contains(request.SearchTerm)) ||
                        (d.Qualifications != null && d.Qualifications.Contains(request.SearchTerm))

                    );
                }

                if (request.SpecializationId.HasValue)
                {
                    query = query.Where(d => d.SpecializationId == request.SpecializationId);
                }

                if (!string.IsNullOrEmpty(request.City))
                {
                    query = query.Where(d => d.User.City == request.City);
                }

                if (request.MinFee.HasValue)
                {
                    query = query.Where(d => d.ConsultationFee >= request.MinFee.Value);
                }

                if (request.MaxFee.HasValue)
                {
                    query = query.Where(d => d.ConsultationFee <= request.MaxFee.Value);
                }

                if (request.IsVerified.HasValue)
                {
                    query = query.Where(d => d.IsVerified == request.IsVerified.Value);
                }

                // Sắp xếp
                query = (request.SortBy?.ToLower()) switch
                {
                    "fee" => request.SortDescending
                        ? query.OrderByDescending(d => d.ConsultationFee)
                        : query.OrderBy(d => d.ConsultationFee),
                    "experience" => request.SortDescending
                        ? query.OrderByDescending(d => d.YearsExperience)
                        : query.OrderBy(d => d.YearsExperience),
                    "name" => request.SortDescending
                        ? query.OrderByDescending(d => d.User.FullName)
                        : query.OrderBy(d => d.User.FullName),
                    _ => request.SortDescending
                        ? query.OrderByDescending(d => d.Rating)
                        : query.OrderBy(d => d.Rating)
                };

                var totalCount = await query.CountAsync();

                var doctors = await query
                    .Skip((request.Page - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .Select(d => new DoctorResponse
                    {
                        Id = d.Id,
                        UserId = d.UserId,
                        User = new UserResponse
                        {
                            Id = d.User.Id,
                            Email = d.User.Email,
                            FullName = d.User.FullName,
                            Role = d.User.Role.ToString(),
                            PhoneNumber = d.User.PhoneNumber,
                            DateOfBirth = d.User.DateOfBirth,
                            Address = d.User.Address,
                            City = d.User.City,
                            AvatarUrl = d.User.AvatarUrl,
                            IsActive = d.User.IsActive,
                            IsEmailVerified = d.User.IsEmailVerified,
                            CreatedAt = d.User.CreatedAt,
                            UpdatedAt = d.User.UpdatedAt
                        },
                        MedicalLicense = d.MedicalLicense,
                        LicenseImageUrl = d.LicenseImageUrl,
                        SpecializationId = d.SpecializationId,
                        Specialization = d.Specialization != null ? new SpecializationResponse
                        {
                            Id = d.Specialization.Id,
                            Name = d.Specialization.Name,
                            Description = d.Specialization.Description,
                            IconUrl = d.Specialization.IconUrl,
                            IsActive = d.Specialization.IsActive
                        } : null,
                        YearsExperience = d.YearsExperience,
                        Qualifications = d.Qualifications,
                        Bio = d.Bio,
                        ConsultationFee = d.ConsultationFee,
                        Rating = d.Rating,
                        TotalReviews = d.TotalReviews,
                        IsVerified = d.IsVerified,
                        CreatedAt = d.CreatedAt,
                        UpdatedAt = d.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = doctors,
                    pagination = new
                    {
                        total = totalCount,
                        page = request.Page,
                        pageSize = request.PageSize,
                        totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting doctors");
                return StatusCode(500, new { message = $"Lỗi server: {ex.Message}" });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDoctor(int id)
        {
            try
            {
                var doctor = await _context.Doctors
                    .Include(d => d.User)
                    .Include(d => d.Specialization)
                    .FirstOrDefaultAsync(d => d.Id == id && d.User.IsActive);

                if (doctor == null)
                {
                    return NotFound(new { message = "Không tìm thấy bác sĩ" });
                }

                var response = new DoctorResponse
                {
                    Id = doctor.Id,
                    UserId = doctor.UserId,
                    User = new UserResponse
                    {
                        Id = doctor.User.Id,
                        Email = doctor.User.Email,
                        FullName = doctor.User.FullName,
                        Role = doctor.User.Role.ToString(),
                        PhoneNumber = doctor.User.PhoneNumber,
                        DateOfBirth = doctor.User.DateOfBirth,
                        Address = doctor.User.Address,
                        City = doctor.User.City,
                        AvatarUrl = doctor.User.AvatarUrl,
                        IsActive = doctor.User.IsActive,
                        IsEmailVerified = doctor.User.IsEmailVerified,
                        CreatedAt = doctor.User.CreatedAt,
                        UpdatedAt = doctor.User.UpdatedAt
                    },
                    MedicalLicense = doctor.MedicalLicense,
                    LicenseImageUrl = doctor.LicenseImageUrl,
                    SpecializationId = doctor.SpecializationId,
                    Specialization = doctor.Specialization != null ? new SpecializationResponse
                    {
                        Id = doctor.Specialization.Id,
                        Name = doctor.Specialization.Name,
                        Description = doctor.Specialization.Description,
                        IconUrl = doctor.Specialization.IconUrl,
                        IsActive = doctor.Specialization.IsActive
                    } : null,
                    YearsExperience = doctor.YearsExperience,
                    Qualifications = doctor.Qualifications,
                    Bio = doctor.Bio,
                    ConsultationFee = doctor.ConsultationFee,
                    Rating = doctor.Rating,
                    TotalReviews = doctor.TotalReviews,
                    IsVerified = doctor.IsVerified,
                    CreatedAt = doctor.CreatedAt,
                    UpdatedAt = doctor.UpdatedAt
                };

                return Ok(new { success = true, data = response });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting doctor with id {id}");
                return StatusCode(500, new { message = $"Lỗi server: {ex.Message}" });
            }
        }

        // Thêm vào AdminController.cs
        [HttpGet("doctors/pending")]
        public async Task<IActionResult> GetPendingDoctors()
        {
            try
            {
                var pendingDoctors = await _context.Doctors
                    .Include(d => d.User)
                    .Include(d => d.Specialization)
                    .Where(d => !d.IsVerified && d.User.IsActive)
                    .Select(d => new
                    {
                        d.Id,
                        d.UserId,
                        d.MedicalLicense,
                        d.LicenseImageUrl,
                        d.SpecializationId,
                        d.YearsExperience,
                        d.Qualifications,
                        d.Bio,
                        d.ConsultationFee,
                        d.Rating,
                        d.TotalReviews,
                        d.IsVerified,
                        d.CreatedAt,
                        User = new
                        {
                            d.User.Id,
                            d.User.Email,
                            d.User.FullName,
                            d.User.PhoneNumber,
                            d.User.DateOfBirth,
                            d.User.Address,
                            d.User.City,
                            d.User.AvatarUrl,
                            d.User.IsActive
                        },
                        Specialization = d.Specialization != null ? new
                        {
                            d.Specialization.Id,
                            d.Specialization.Name,
                            d.Specialization.Description,
                            d.Specialization.IconUrl
                        } : null
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = pendingDoctors
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách bác sĩ chờ xác minh");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Đã xảy ra lỗi khi lấy danh sách bác sĩ chờ xác minh"
                });
            }
        }

        [HttpGet("reports")]
        public async Task<IActionResult> GetReports([FromQuery] string period = "month")
        {
            try
            {
                // Implement report logic based on period
                var now = DateTime.UtcNow;
                DateTime startDate = period switch
                {
                    "day" => now.Date,
                    "week" => now.AddDays(-7),
                    "month" => now.AddMonths(-1),
                    "year" => now.AddYears(-1),
                    _ => now.AddMonths(-1)
                };

                var totalAppointments = await _context.Appointments
                    .Where(a => a.CreatedAt >= startDate)
                    .CountAsync();

                var totalRevenue = await _context.Payments
    .Where(p => p.PaidAt >= startDate && p.Status == PaymentStatus.Success)
    .SumAsync(p => p.Amount);

                var newUsers = await _context.Users
                    .Where(u => u.CreatedAt >= startDate)
                    .CountAsync();

                var completedAppointments = await _context.Appointments
    .Where(a => a.CreatedAt >= startDate && a.Status == AppointmentStatus.Completed)
    .CountAsync();

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        totalAppointments,
                        totalRevenue,
                        newUsers,
                        completedAppointments
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy báo cáo");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Đã xảy ra lỗi khi lấy báo cáo"
                });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Doctor,SystemAdmin")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] DoctorUpdateRequest request)
        {
            try
            {
                var doctor = await _context.Doctors
                    .Include(d => d.User)
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (doctor == null)
                {
                    return NotFound(new { message = "Không tìm thấy bác sĩ" });
                }

                var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

                if (string.IsNullOrEmpty(currentUserIdClaim))
                {
                    return Unauthorized(new { message = "Không xác định được người dùng" });
                }

                var currentUserId = int.Parse(currentUserIdClaim);

                if (currentUserRole != "SystemAdmin" && doctor.UserId != currentUserId)
                {
                    return Forbid();
                }

                if (!string.IsNullOrEmpty(request.MedicalLicense))
                {
                    doctor.MedicalLicense = request.MedicalLicense;
                }

                if (!string.IsNullOrEmpty(request.LicenseImageUrl))
                {
                    doctor.LicenseImageUrl = request.LicenseImageUrl;
                }

                if (request.SpecializationId.HasValue)
                {
                    doctor.SpecializationId = request.SpecializationId;
                }

                doctor.YearsExperience = request.YearsExperience;
                doctor.Qualifications = request.Qualifications ?? doctor.Qualifications;
                doctor.Bio = request.Bio ?? doctor.Bio;
                doctor.ConsultationFee = request.ConsultationFee;
                doctor.UpdatedAt = DateTime.UtcNow;

                _context.Doctors.Update(doctor);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Cập nhật thông tin bác sĩ thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating doctor with id {id}");
                return StatusCode(500, new { message = $"Lỗi server: {ex.Message}" });
            }
        }

        public class VerifyDoctorRequest
        {
            public bool IsVerified { get; set; }
        }

        [HttpPut("{id}/verify")]
        [Authorize(Roles = "SystemAdmin")]
        public async Task<IActionResult> VerifyDoctor(int id, VerifyDoctorRequest request)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return NotFound();

            doctor.IsVerified = request.IsVerified;
            doctor.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok("Cập nhật trạng thái xác minh thành công");
        }
    }
}