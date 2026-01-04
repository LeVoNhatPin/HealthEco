using Microsoft.AspNetCore.Mvc;

namespace HealthEco.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                Status = "Healthy",
                Timestamp = DateTime.UtcNow,
                Service = "HealthEco API",
                Version = "1.0.0"
            });
        }
    }
}