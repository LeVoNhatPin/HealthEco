using Microsoft.AspNetCore.Mvc;

namespace HealthEco.API.Controllers
{
    public abstract class BaseController : ControllerBase
    {
        protected readonly ILogger _logger;

        protected BaseController(ILogger logger)
        {
            _logger = logger;
        }

        protected int GetUserId()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
        }

        protected string GetUserEmail()
        {
            var emailClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Email);
            return emailClaim?.Value ?? string.Empty;
        }
    }
}