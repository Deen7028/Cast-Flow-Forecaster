using Backend.DTOs.Recurring;
using Backend.Interfaces;
using Backend.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecurringController : ControllerBase
{
    private readonly IRecurringService _recurringService;

    public RecurringController(IRecurringService recurringService)
    {
        _recurringService = recurringService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<RecurringRuleDto>> GetAll()
    {
        var rules = _recurringService.GetAll();
        return Ok(rules);
    }

    [HttpGet("{id}")]
    public ActionResult<RecurringRuleDto> GetById(int id)
    {
        var rule = _recurringService.GetById(id);
        if (rule == null) return NotFound();
        return Ok(rule);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateRecurringRuleDto dto)
    {
        var result = _recurringService.Create(dto);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var result = _recurringService.Delete(id);
        if (!result) return NotFound();
        return Ok(result);
    }

    [HttpGet("{id}/history")]
    public IActionResult GetHistory(int id)
    {
        var result = _recurringService.GetHistory(id);
        return Ok(result);
    }

    [HttpPost("bulk-status")]
    public IActionResult BulkUpdateStatus([FromBody] BulkStatusRequest request)
    {
        var result = _recurringService.BulkUpdateStatus(request.Ids, request.IsActive);
        return Ok(result);
    }

    [HttpPost("bulk-delete")]
    public IActionResult BulkDelete([FromBody] List<int> ids)
    {
        var result = _recurringService.BulkDelete(ids);
        return Ok(result);
    }


}

public class BulkStatusRequest
{
    public List<int> Ids { get; set; } = new();
    public bool IsActive { get; set; }
}
