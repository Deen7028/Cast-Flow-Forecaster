using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnomaliesController : ControllerBase
    {
        private readonly IAnomalyService _objService;

        public AnomaliesController(IAnomalyService objService)
        {
            _objService = objService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { status = "success", data = _objService.GetActiveAnomalies() });
        }

        [HttpPost("{nId}/review")]
        public IActionResult Review(int nId)
        {
            if (_objService.MarkAsReviewed(nId))
            {
                return Ok(new { status = "success", message = "Review completed" });
            }
            return NotFound(new { status = "error", message = "Anomaly not found" });
        }
    }
}
