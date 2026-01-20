// HealthEco.API/Controllers/MedicalFacilitiesController.cs
using HealthEco.Core.DTOs.Clinic;
using HealthEco.Core.Entities;
using HealthEco.Core.Entities.Enums;
using HealthEco.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthEco.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalFacilitiesController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public MedicalFacilitiesController(
            ApplicationDbContext context,
            ILogger<BaseController> logger
        ) : base(logger)
        {
            _context = context;
        }

        // ============================
        // REGISTER CLINIC
        // ============================
        [HttpPost]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> RegisterClinic([FromBody] MedicalFacilityRequest request)
        {
            try
            {
                var doctorId = GetUserId();
                if (doctorId <= 0) return Unauthorized();

                var doctor = await _context.Doctors
                    .Include(d => d.User)
                    .FirstOrDefaultAsync(d => d.Id == doctorId && d.IsVerified);

                if (doctor == null)
                {
                    return BadRequest(new { success = false, message = "Bác sĩ không tồn tại hoặc chưa xác minh" });
                }

                if (await _context.MedicalFacilities.AnyAsync(m => m.LicenseNumber == request.LicenseNumber))
                {
                    return BadRequest(new { success = false, message = "Số giấy phép đã được đăng ký" });
                }

                var clinic = new MedicalFacility
                {
                    Name = request.Name,
                    Code = GenerateClinicCode(),
                    FacilityType = request.FacilityType,
                    OwnerId = doctorId,
                    LicenseNumber = request.LicenseNumber,
                    LicenseImageUrl = request.LicenseImageUrl,
                    Address = request.Address,
                    City = request.City,
                    Phone = request.Phone,
                    Email = request.Email,
                    OperatingHours = request.OperatingHours ?? "{}",
                    Services = request.Services ?? "[]",
                    Description = request.Description,
                    AvatarUrl = request.AvatarUrl,
                    BannerUrl = request.BannerUrl,
                    IsActive = true,
                    IsVerified = false,
                    Rating = 0,
                    TotalReviews = 0,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.MedicalFacilities.Add(clinic);
                await _context.SaveChangesAsync();

                _context.DoctorFacilityWorks.Add(new DoctorFacilityWork
                {
                    DoctorId = doctorId,
                    FacilityId = clinic.Id,
                    Status = DoctorFacilityWorkStatus.Approved,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Đăng ký cơ sở y tế thành công. Vui lòng chờ xác minh."
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "RegisterClinic error");
                return StatusCode(500, new { success = false, message = "Lỗi server" });
            }
        }

        // ============================
        // GET CLINICS
        // ============================
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetClinics([FromQuery] ClinicSearchRequest request)
        {
            var query = _context.MedicalFacilities
                .Include(m => m.Owner).ThenInclude(o => o.User)
                .Where(m => m.IsActive)
                .AsQueryable();

            if (!string.IsNullOrEmpty(request.SearchTerm))
            {
                query = query.Where(m =>
                    m.Name.Contains(request.SearchTerm) ||
                    m.Address.Contains(request.SearchTerm) ||
                    m.City.Contains(request.SearchTerm));
            }

            if (request.FacilityType.HasValue)
                query = query.Where(m => m.FacilityType == request.FacilityType.Value);


            if (!string.IsNullOrEmpty(request.City))
                query = query.Where(m => m.City == request.City);

            if (request.IsVerified.HasValue)
                query = query.Where(m => m.IsVerified == request.IsVerified);

            query = (request.SortBy ?? "rating").ToLower() switch
            {
                "name" => request.SortDescending ? query.OrderByDescending(m => m.Name) : query.OrderBy(m => m.Name),
                "city" => request.SortDescending ? query.OrderByDescending(m => m.City) : query.OrderBy(m => m.City),
                _ => request.SortDescending ? query.OrderByDescending(m => m.Rating) : query.OrderBy(m => m.Rating)
            };

            var total = await query.CountAsync();

            var data = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data,
                pagination = new
                {
                    total,
                    request.Page,
                    request.PageSize
                }
            });
        }

        // ============================
        // GET MY CLINICS
        // ============================
        [HttpGet("my-clinics")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetMyClinics()
        {
            var doctorId = GetUserId();
            if (doctorId <= 0) return Unauthorized();

            var clinics = await _context.DoctorFacilityWorks
                .Include(x => x.MedicalFacility)
                .Where(x => x.DoctorId == doctorId && x.Status == DoctorFacilityWorkStatus.Approved)
                .Select(x => x.MedicalFacility)
                .ToListAsync();

            return Ok(new { success = true, data = clinics });
        }

        private string GenerateClinicCode()
        {
            return $"CLINIC-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}";
        }
    }
}
