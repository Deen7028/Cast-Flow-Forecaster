using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _objDashboardService;

        public DashboardController(IDashboardService objDashboardService)
        {
            _objDashboardService = objDashboardService;
        }

        [HttpGet("metrics")]
        public IActionResult GetMetrics()
        {
            return Ok(new { status = "success", data = _objDashboardService.GetDashboardMetrics() });
        }
    }
}
