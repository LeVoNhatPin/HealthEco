using HealthEco.Application.Services;
using HealthEco.Core.DTOs;
using HealthEco.Core.DTOs.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HealthEco.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService userService, ILogger<UsersController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        // GET: api/users/me
        [HttpGet("me")]
        public async Task<ActionResult<UserProfileDto>> GetCurrentUser()
        {
            try
            {
                var userId = GetCurrentUserId();
                var userProfile = await _userService.GetUserProfileAsync(userId);
                return Ok(userProfile);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current user profile");
                return StatusCode(500, new { message = "An error occurred while getting user profile" });
            }
        }

        // PUT: api/users/me
        [HttpPut("me")]
        public async Task<ActionResult<UserProfileDto>> UpdateCurrentUser([FromBody] UpdateProfileRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var updatedUser = await _userService.UpdateUserProfileAsync(userId, request);
                return Ok(updatedUser);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user profile");
                return StatusCode(500, new { message = "An error occurred while updating user profile" });
            }
        }

        // POST: api/users/change-password
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _userService.ChangePasswordAsync(userId, request);
                return Ok(new { message = "Password changed successfully" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password");
                return StatusCode(500, new { message = "An error occurred while changing password" });
            }
        }

        // POST: api/users/avatar
        [HttpPost("avatar")]
        public async Task<ActionResult<string>> UpdateAvatar([FromBody] UpdateAvatarRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var avatarUrl = await _userService.UpdateAvatarAsync(userId, request.AvatarUrl);
                return Ok(new { avatarUrl });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating avatar");
                return StatusCode(500, new { message = "An error occurred while updating avatar" });
            }
        }

        // ADMIN ENDPOINTS

        // GET: api/users
        [HttpGet]
        [Authorize(Roles = "SystemAdmin,ClinicAdmin")]
        public async Task<ActionResult<List<UserListDto>>> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all users");
                return StatusCode(500, new { message = "An error occurred while getting users" });
            }
        }

        // GET: api/users/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "SystemAdmin,ClinicAdmin")]
        public async Task<ActionResult<UserProfileDto>> GetUserById(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                return Ok(user);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting user with id {id}");
                return StatusCode(500, new { message = "An error occurred while getting user" });
            }
        }

        // PUT: api/users/{id}/status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "SystemAdmin,ClinicAdmin")]
        public async Task<ActionResult<UserProfileDto>> UpdateUserStatus(int id, [FromBody] UpdateUserStatusRequest request)
        {
            try
            {
                var user = await _userService.UpdateUserStatusAsync(id, request);
                return Ok(user);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating user status for id {id}");
                return StatusCode(500, new { message = "An error occurred while updating user status" });
            }
        }

        // PUT: api/users/{id}/role
        [HttpPut("{id}/role")]
        [Authorize(Roles = "SystemAdmin")]
        public async Task<ActionResult<UserProfileDto>> UpdateUserRole(int id, [FromBody] UpdateUserRoleRequest request)
        {
            try
            {
                var user = await _userService.UpdateUserRoleAsync(id, request.Role);
                return Ok(user);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating user role for id {id}");
                return StatusCode(500, new { message = "An error occurred while updating user role" });
            }
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                throw new UnauthorizedAccessException("Invalid user ID in token");

            return userId;
        }
    }

    // Request DTOs for this controller
    public class UpdateAvatarRequest
    {
        public string AvatarUrl { get; set; }
    }

    public class UpdateUserRoleRequest
    {
        public string Role { get; set; }
    }
}