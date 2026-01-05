using HealthEco.Core.Configuration;
using HealthEco.Core.DTOs;
using HealthEco.Core.DTOs.AuthDto;
using HealthEco.Core.Entities;
using HealthEco.Core.Enums;
using HealthEco.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace HealthEco.API.Controllers
{
    [Route("api/v1/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IEmailService _emailService;
        private readonly JwtSettings _jwtSettings;

        public AuthController(
            IAuthService authService,
            IEmailService emailService,
            IOptions<JwtSettings> jwtSettings)
        {
            _authService = authService;
            _emailService = emailService;
            _jwtSettings = jwtSettings.Value;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var user = new User
                {
                    Email = request.Email,
                    FullName = request.FullName,
                    PhoneNumber = request.PhoneNumber,
                    DateOfBirth = request.DateOfBirth,
                    Address = request.Address,
                    City = request.City,
                    Role = Enum.Parse<UserRole>(request.Role, true)
                };

                var result = await _authService.RegisterAsync(user, request.Password);
                var createdUser = result.user;
                var token = result.token;
                var refreshToken = result.refreshToken;

                var response = new AuthResponse
                {
                    Success = true,
                    Message = "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.",
                    Data = new AuthData
                    {
                        Token = token,
                        RefreshToken = refreshToken,
                        User = MapToUserDto(createdUser)
                    }
                };

                return Ok(response);
            }
            catch (AuthException ex)
            {
                return BadRequest(new AuthResponse
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var result = await _authService.LoginAsync(request.Email, request.Password);
                var user = result.user;
                var token = result.token;
                var refreshToken = result.refreshToken;

                var response = new AuthResponse
                {
                    Success = true,
                    Message = "Đăng nhập thành công",
                    Data = new AuthData
                    {
                        Token = token,
                        RefreshToken = refreshToken,
                        User = MapToUserDto(user)
                    }
                };

                return Ok(response);
            }
            catch (AuthException ex)
            {
                return Unauthorized(new AuthResponse
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var result = await _authService.RefreshTokenAsync(request.Token, request.RefreshToken);
                var user = result.user;
                var token = result.token;
                var refreshToken = result.refreshToken;

                var response = new AuthResponse
                {
                    Success = true,
                    Message = "Token đã được làm mới",
                    Data = new AuthData
                    {
                        Token = token,
                        RefreshToken = refreshToken,
                        User = MapToUserDto(user)
                    }
                };

                return Ok(response);
            }
            catch (AuthException ex)
            {
                return Unauthorized(new AuthResponse
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            // Get user ID from claims
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new BaseResponse
                {
                    Success = false,
                    Message = "Không tìm thấy thông tin người dùng"
                });
            }

            var userId = int.Parse(userIdClaim.Value);
            await _authService.LogoutAsync(userId);

            return Ok(new BaseResponse
            {
                Success = true,
                Message = "Đăng xuất thành công"
            });
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            try
            {
                var success = await _authService.VerifyEmailAsync(token);

                if (success)
                {
                    return Ok(new BaseResponse
                    {
                        Success = true,
                        Message = "Email đã được xác thực thành công"
                    });
                }

                return BadRequest(new BaseResponse
                {
                    Success = false,
                    Message = "Xác thực email thất bại"
                });
            }
            catch (AuthException ex)
            {
                return BadRequest(new BaseResponse
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                var token = await _authService.GeneratePasswordResetTokenAsync(request.Email);

                // Send email with reset link
                var resetLink = $"{_jwtSettings.FrontendUrl}/reset-password?token={token}";

                // In production, send actual email
                await _emailService.SendEmailAsync(request.Email,
                    "Đặt lại mật khẩu HealthEco",
                    $"Nhấp vào link để đặt lại mật khẩu: {resetLink}");

                return Ok(new BaseResponse
                {
                    Success = true,
                    Message = "Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn"
                });
            }
            catch (AuthException ex)
            {
                return NotFound(new BaseResponse
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                var success = await _authService.ResetPasswordAsync(request.Token, request.NewPassword);

                if (success)
                {
                    return Ok(new BaseResponse
                    {
                        Success = true,
                        Message = "Mật khẩu đã được đặt lại thành công"
                    });
                }

                return BadRequest(new BaseResponse
                {
                    Success = false,
                    Message = "Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"
                });
            }
            catch (AuthException ex)
            {
                return BadRequest(new BaseResponse
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);

            try
            {
                var success = await _authService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword);

                if (success)
                {
                    return Ok(new BaseResponse
                    {
                        Success = true,
                        Message = "Mật khẩu đã được thay đổi thành công"
                    });
                }

                return BadRequest(new BaseResponse
                {
                    Success = false,
                    Message = "Mật khẩu hiện tại không đúng"
                });
            }
            catch (AuthException ex)
            {
                return BadRequest(new BaseResponse
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var emailClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Email);
            if (emailClaim == null)
            {
                return Unauthorized();
            }

            var user = await _authService.GetUserByEmailAsync(emailClaim.Value);

            if (user == null)
            {
                return NotFound(new BaseResponse
                {
                    Success = false,
                    Message = "Người dùng không tồn tại"
                });
            }

            return Ok(new DataResponse<UserDto>
            {
                Success = true,
                Message = "Lấy thông tin người dùng thành công",
                Data = MapToUserDto(user)
            });
        }

        [Authorize]
        [HttpGet("activity")]
        public async Task<IActionResult> GetUserActivity([FromQuery] int days = 30)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            var activities = await _authService.GetUserActivityLogsAsync(userId, days);

            return Ok(new DataResponse<IEnumerable<ActivityLogDto>>
            {
                Success = true,
                Message = "Lấy lịch sử hoạt động thành công",
                Data = activities.Select(a => new ActivityLogDto
                {
                    Action = a.Action,
                    Description = a.Description,
                    IpAddress = a.IpAddress,
                    UserAgent = a.UserAgent,
                    Location = a.Location,
                    CreatedAt = a.CreatedAt
                })
            });
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
                CreatedAt = user.CreatedAt
            };
        }
    }
}