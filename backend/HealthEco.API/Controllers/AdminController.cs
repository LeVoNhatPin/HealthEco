using HealthEco.Core.DTOs;
using HealthEco.Core.DTOs.Auth;
using HealthEco.Core.Entities;
using HealthEco.Core.Enums;
using HealthEco.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthEco.API.Controllers
{
    [Route("api/v1/admin")]
    [ApiController]
    [Authorize(Policy = "AdminOnly")]
    public class AdminController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context, ILogger<AdminController> logger) : base(logger)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách người dùng (phân trang, tìm kiếm)
        /// </summary>
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] string? role = null)
        {
            try
            {
                var query = _context.Users.AsQueryable();

                // Tìm kiếm
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(u =>
                        u.Email.Contains(search) ||
                        u.FullName.Contains(search) ||
                        u.PhoneNumber.Contains(search));
                }

                // Lọc theo role
                if (!string.IsNullOrEmpty(role) && Enum.TryParse<UserRole>(role, out var roleEnum))
                {
                    query = query.Where(u => u.Role == roleEnum);
                }

                var totalCount = await query.CountAsync();
                var users = await query
                    .OrderByDescending(u => u.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(u => new UserListDto
                    {
                        Id = u.Id,
                        Email = u.Email,
                        FullName = u.FullName,
                        Role = u.Role.ToString(),
                        PhoneNumber = u.PhoneNumber,
                        IsActive = u.IsActive,
                        IsEmailVerified = u.IsEmailVerified,
                        CreatedAt = u.CreatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách người dùng thành công",
                    data = new
                    {
                        users,
                        pagination = new
                        {
                            page,
                            pageSize,
                            totalCount,
                            totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách người dùng");
                return StatusCode(500, new BaseResponse
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi lấy danh sách người dùng"
                });
            }
        }

        /// <summary>
        /// Lấy thông tin chi tiết người dùng
        /// </summary>
        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _context.Users
                    .Where(u => u.Id == id)
                    .Select(u => new UserDto
                    {
                        Id = u.Id,
                        Email = u.Email,
                        FullName = u.FullName,
                        Role = u.Role.ToString(),
                        PhoneNumber = u.PhoneNumber,
                        AvatarUrl = u.AvatarUrl,
                        DateOfBirth = u.DateOfBirth,
                        Address = u.Address,
                        City = u.City,
                        IsActive = u.IsActive,
                        IsEmailVerified = u.IsEmailVerified,
                        ThemePreference = u.ThemePreference,
                        LanguagePreference = u.LanguagePreference,
                        CreatedAt = u.CreatedAt,
                        UpdatedAt = u.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return NotFound(new BaseResponse
                    {
                        Success = false,
                        Message = "Không tìm thấy người dùng"
                    });
                }

                return Ok(new DataResponse<UserDto>
                {
                    Success = true,
                    Message = "Lấy thông tin người dùng thành công",
                    Data = user
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thông tin người dùng");
                return StatusCode(500, new BaseResponse
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi lấy thông tin người dùng"
                });
            }
        }

        /// <summary>
        /// Cập nhật trạng thái người dùng (active/inactive)
        /// </summary>
        [HttpPut("users/{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] UpdateUserStatusRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new BaseResponse
                    {
                        Success = false,
                        Message = "Không tìm thấy người dùng"
                    });
                }

                user.IsActive = request.IsActive;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new BaseResponse
                {
                    Success = true,
                    Message = $"Đã {(request.IsActive ? "kích hoạt" : "vô hiệu hóa")} tài khoản thành công"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật trạng thái người dùng");
                return StatusCode(500, new BaseResponse
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi cập nhật trạng thái người dùng"
                });
            }
        }

        /// <summary>
        /// Thống kê hệ thống
        /// </summary>
        [HttpGet("statistics")]
        public async Task<IActionResult> GetStatistics()
        {
            try
            {
                var totalUsers = await _context.Users.CountAsync();
                var activeUsers = await _context.Users.CountAsync(u => u.IsActive);
                var patients = await _context.Users.CountAsync(u => u.Role == UserRole.Patient);
                var doctors = await _context.Users.CountAsync(u => u.Role == UserRole.Doctor);
                var admins = await _context.Users.CountAsync(u =>
                    u.Role == UserRole.SystemAdmin || u.Role == UserRole.ClinicAdmin);

                return Ok(new
                {
                    success = true,
                    message = "Lấy thống kê thành công",
                    data = new
                    {
                        totalUsers,
                        activeUsers,
                        patients,
                        doctors,
                        admins,
                        inactiveUsers = totalUsers - activeUsers
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thống kê");
                return StatusCode(500, new BaseResponse
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi lấy thống kê"
                });
            }
        }
    }

    public class UpdateUserStatusRequest
    {
        public bool IsActive { get; set; }
    }

    public class UserListDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool IsEmailVerified { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}