// HealthEco.API/Controllers/BaseController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace HealthEco.API.Controllers
{
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        protected readonly ILogger<BaseController> _logger;

        public BaseController(ILogger<BaseController> logger)
        {
            _logger = logger;
        }

        protected ILogger<BaseController> Logger => _logger;

        protected int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return userIdClaim != null ? int.Parse(userIdClaim) : 0;
        }

        protected string GetUserEmail()
        {
            return User.FindFirst(ClaimTypes.Email)?.Value ?? string.Empty;
        }

        protected string GetUserRole()
        {
            return User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
        }

        protected string GetUserName()
        {
            return User.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty;
        }
    }
}