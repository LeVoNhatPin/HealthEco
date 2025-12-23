using HealthEco.Application.Services;
using HealthEco.Core.DTOs.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthEco.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "SystemAdmin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IUserService userService, ILogger<AdminController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        // GET: api/admin/dashboard/stats
        [HttpGet("dashboard/stats")]
        public async Task<ActionResult<AdminDashboardStats>> GetDashboardStats()
        {
            try
            {
                // For now, return mock data. We'll implement actual stats in later days.
                var stats = new AdminDashboardStats
                {
                    TotalUsers = 150,
                    TotalDoctors = 25,
                    TotalClinics = 10,
                    TotalAppointments = 500,
                    TodayAppointments = 15,
                    PendingApprovals = 5,
                    RevenueThisMonth = 25000000,
                    ActiveUsers = 120
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin dashboard stats");
                return StatusCode(500, new { message = "An error occurred while getting dashboard stats" });
            }
        }

        // GET: api/admin/users/search
        [HttpGet("users/search")]
        public async Task<ActionResult<List<UserListDto>>> SearchUsers(
            [FromQuery] string searchTerm = "",
            [FromQuery] string role = "",
            [FromQuery] bool? isActive = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var allUsers = await _userService.GetAllUsersAsync();

                // Apply filters
                var filteredUsers = allUsers.AsEnumerable();

                if (!string.IsNullOrEmpty(searchTerm))
                {
                    filteredUsers = filteredUsers.Where(u =>
                        u.FullName.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                        u.Email.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                        u.PhoneNumber.Contains(searchTerm, StringComparison.OrdinalIgnoreCase));
                }

                if (!string.IsNullOrEmpty(role))
                {
                    filteredUsers = filteredUsers.Where(u => u.Role == role);
                }

                if (isActive.HasValue)
                {
                    filteredUsers = filteredUsers.Where(u => u.IsActive == isActive.Value);
                }

                // Pagination
                var totalCount = filteredUsers.Count();
                var pagedUsers = filteredUsers
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var result = new
                {
                    Users = pagedUsers,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching users");
                return StatusCode(500, new { message = "An error occurred while searching users" });
            }
        }
    }

    public class AdminDashboardStats
    {
        public int TotalUsers { get; set; }
        public int TotalDoctors { get; set; }
        public int TotalClinics { get; set; }
        public int TotalAppointments { get; set; }
        public int TodayAppointments { get; set; }
        public int PendingApprovals { get; set; }
        public decimal RevenueThisMonth { get; set; }
        public int ActiveUsers { get; set; }
    }
}