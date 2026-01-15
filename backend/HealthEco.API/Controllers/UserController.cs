using HealthEco.Core.DTOs;
using HealthEco.Core.DTOs.Auth;
using HealthEco.Core.Entities;
using HealthEco.Infrastructure.Data;
using HealthEco.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthEco.API.Controllers
{
    [Route("api/v1/user")]
    [ApiController]
    [Authorize]
    public class UserController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context, ILogger<UserController> logger) : base(logger)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy thông tin người dùng hiện tại
        /// </summary>
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = GetUserId();
                if (userId == 0)
                {
                    return Unauthorized(new BaseResponse
                    {
                        Success = false,
                        Message = "Không xác định được người dùng"
                    });
                }

                var user = await _context.Users.FindAsync(userId);
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
                    Message = "Lấy thông tin cá nhân thành công",
                    Data = MapToUserDto(user)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thông tin cá nhân");
                return StatusCode(500, new BaseResponse
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi lấy thông tin cá nhân"
                });
            }
        }

        /// <summary>
        /// Cập nhật thông tin cá nhân
        /// </summary>
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(
    [FromBody] UpdateProfileRequest request
)
        {
            var userId = GetUserId();
            if (userId == 0)
                return Unauthorized(new BaseResponse { Success = false, Message = "Unauthorized" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new BaseResponse { Success = false, Message = "User not found" });

            user.FullName = request.FullName ?? user.FullName;
            user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;
            user.DateOfBirth = request.DateOfBirth ?? user.DateOfBirth;
            user.Address = request.Address ?? user.Address;
            user.City = request.City ?? user.City;
            user.AvatarUrl = request.AvatarUrl ?? user.AvatarUrl;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new DataResponse<UserDto>
            {
                Success = true,
                Message = "Cập nhật thông tin thành công",
                Data = MapToUserDto(user)
            });
        }

        /// <summary>
        /// Đổi mật khẩu (đã có trong AuthController, nhưng có thể giữ ở đây)
        /// </summary>
        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                var userId = GetUserId();
                if (userId == 0)
                {
                    return Unauthorized(new BaseResponse
                    {
                        Success = false,
                        Message = "Không xác định được người dùng"
                    });
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new BaseResponse
                    {
                        Success = false,
                        Message = "Không tìm thấy người dùng"
                    });
                }

                // Kiểm tra mật khẩu hiện tại
                if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
                {
                    return BadRequest(new BaseResponse
                    {
                        Success = false,
                        Message = "Mật khẩu hiện tại không đúng"
                    });
                }

                // Cập nhật mật khẩu mới
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new BaseResponse
                {
                    Success = true,
                    Message = "Đổi mật khẩu thành công"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi đổi mật khẩu");
                return StatusCode(500, new BaseResponse
                {   
                    Success = false,
                    Message = "Đã xảy ra lỗi khi đổi mật khẩu"
                });
            }
        }

        private UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role.ToString(),
                PhoneNumber = user.PhoneNumber,
                AvatarUrl = user.AvatarUrl,
                DateOfBirth = user.DateOfBirth,
                Address = user.Address,
                City = user.City,
                IsActive = user.IsActive,
                IsEmailVerified = user.IsEmailVerified,
                ThemePreference = user.ThemePreference,
                LanguagePreference = user.LanguagePreference,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }
    }

    public class UpdateProfileRequest
    {
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? AvatarUrl { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}