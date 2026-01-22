// HealthEco.API/Controllers/BaseController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace HealthEco.API.Controllers
{
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        protected readonly ILogger? _logger;
        protected BaseController(ILogger? logger = null)
        {
            _logger = logger;
        }

        protected ILogger? Logger => _logger;

        protected int GetUserId()
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier)
                ?? User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");

            if (userIdClaim == null)
                return 0;

            return int.TryParse(userIdClaim.Value, out var id) ? id : 0;
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
