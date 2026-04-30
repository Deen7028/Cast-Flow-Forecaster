using Backend.DTOs;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnomaliesController : ControllerBase
{
    private readonly IAnomalyService _anomalyService;

    public AnomaliesController(IAnomalyService anomalyService)
    {
        _anomalyService = anomalyService;
    }

    [HttpGet("alerts")]
    public ActionResult<IEnumerable<AnomalyAlertDto>> GetAlerts()
    {
        var alerts = _anomalyService.GetAlerts();
        return Ok(alerts);
    }

    [HttpGet("rules")]
    public ActionResult<IEnumerable<DetectionRuleDto>> GetRules()
    {
        var rules = _anomalyService.GetRules();
        return Ok(rules);
    }

    [HttpPut("rules/{id}")]
    public IActionResult ToggleRule(string id, [FromBody] ToggleRuleRequest request)
    {
        var success = _anomalyService.ToggleRule(id, request.IsActive);
        if (!success)
        {
            return NotFound(new { message = "Rule not found" });
        }
        return NoContent();
    }

    [HttpPost("alerts/{id}/review")]
    public IActionResult MarkAsReviewed(int id)
    {
        var success = _anomalyService.MarkAsReviewed(id);
        if (!success)
        {
            return NotFound(new { message = "Alert not found" });
        }
        return NoContent();
    }

    [HttpPost("detect")]
    public IActionResult TriggerDetection()
    {
        _anomalyService.RunDetection();
        return Ok(new { message = "Detection process completed" });
    }
}

public class ToggleRuleRequest
{
    public bool IsActive { get; set; }
}
