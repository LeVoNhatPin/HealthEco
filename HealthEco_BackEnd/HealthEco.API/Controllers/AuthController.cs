using HealthEco.Core.Entities;
using HealthEco.Core.Interfaces;
using HealthEco.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace HealthEco.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly TokenService _tokenService;

        public AuthController(IUserRepository userRepository, TokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                // Validate request
                if (await _userRepository.UserExistsAsync(request.Email))
                    return BadRequest(new { message = "Email already exists" });

                // Create user
                var user = new User
                {
                    Email = request.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    FullName = request.FullName,
                    Role = "Patient", // Default role
                    PhoneNumber = request.PhoneNumber,
                    DateOfBirth = request.DateOfBirth,
                    Address = request.Address,
                    City = request.City,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                await _userRepository.AddAsync(user);

                // Generate tokens
                var accessToken = _tokenService.GenerateAccessToken(user);
                var refreshToken = _tokenService.GenerateRefreshToken();

                return Ok(new ApiResponse<AuthResponse>
                {
                    Success = true,
                    Message = "Registration successful",
                    Data = new AuthResponse
                    {
                        AccessToken = accessToken,
                        RefreshToken = refreshToken,
                        User = new UserResponse
                        {
                            Id = user.Id,
                            Email = user.Email,
                            FullName = user.FullName,
                            Role = user.Role,
                            PhoneNumber = user.PhoneNumber,
                            DateOfBirth = user.DateOfBirth,
                            Address = user.Address,
                            City = user.City,
                            CreatedAt = user.CreatedAt
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Registration failed",
                    Error = ex.Message
                });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var user = await _userRepository.GetByEmailAsync(request.Email);

                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    });

                if (!user.IsActive)
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Account is deactivated"
                    });

                // Generate tokens
                var accessToken = _tokenService.GenerateAccessToken(user);
                var refreshToken = _tokenService.GenerateRefreshToken();

                return Ok(new ApiResponse<AuthResponse>
                {
                    Success = true,
                    Message = "Login successful",
                    Data = new AuthResponse
                    {
                        AccessToken = accessToken,
                        RefreshToken = refreshToken,
                        User = new UserResponse
                        {
                            Id = user.Id,
                            Email = user.Email,
                            FullName = user.FullName,
                            Role = user.Role,
                            PhoneNumber = user.PhoneNumber,
                            DateOfBirth = user.DateOfBirth,
                            Address = user.Address,
                            City = user.City,
                            CreatedAt = user.CreatedAt
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Login failed",
                    Error = ex.Message
                });
            }
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var principal = _tokenService.GetPrincipalFromExpiredToken(request.AccessToken);
                var userId = int.Parse(principal.FindFirst(ClaimTypes.NameIdentifier)?.Value);

                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null || !user.IsActive)
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Invalid token"
                    });

                var newAccessToken = _tokenService.GenerateAccessToken(user);
                var newRefreshToken = _tokenService.GenerateRefreshToken();

                return Ok(new ApiResponse<RefreshTokenResponse>
                {
                    Success = true,
                    Message = "Token refreshed",
                    Data = new RefreshTokenResponse
                    {
                        AccessToken = newAccessToken,
                        RefreshToken = newRefreshToken
                    }
                });
            }
            catch (Exception ex)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Invalid token",
                    Error = ex.Message
                });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Logged out successfully"
            });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var user = await _userRepository.GetByIdAsync(userId);

                if (user == null)
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "User not found"
                    });

                return Ok(new ApiResponse<UserResponse>
                {
                    Success = true,
                    Data = new UserResponse
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FullName = user.FullName,
                        Role = user.Role,
                        PhoneNumber = user.PhoneNumber,
                        DateOfBirth = user.DateOfBirth,
                        Address = user.Address,
                        City = user.City,
                        CreatedAt = user.CreatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Failed to get user info",
                    Error = ex.Message
                });
            }
        }
    }

    // Request/Response DTOs
    public class RegisterRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [MaxLength(500)]
        public string? Address { get; set; }

        [MaxLength(100)]
        public string? City { get; set; }
    }

    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class RefreshTokenRequest
    {
        [Required]
        public string AccessToken { get; set; }

        [Required]
        public string RefreshToken { get; set; }
    }

    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
        public string Error { get; set; }
    }

    public class AuthResponse
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public UserResponse User { get; set; }
    }

    public class RefreshTokenResponse
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }

    public class UserResponse
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}