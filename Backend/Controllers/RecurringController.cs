using Backend.DTOs.Recurring;
using Backend.Interfaces;
using Data.Entities;
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
    public async Task<ActionResult<IEnumerable<RecurringRuleDto>>> GetAll()
    {
        var rules = await _recurringService.GetAllAsync();
        return Ok(rules);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RecurringRuleDto>> GetById(int id)
    {
        var rule = await _recurringService.GetByIdAsync(id);
        if (rule == null) return NotFound();
        return Ok(rule);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRecurringRuleDto dto)
    {
        var result = await _recurringService.CreateAsync(dto);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _recurringService.DeleteAsync(id);
        if (!result) return NotFound();
        return Ok(result);
    }

    [HttpGet("{id}/history")]
    public async Task<IActionResult> GetHistory(int id)
    {
        var result = await _recurringService.GetHistoryAsync(id);
        return Ok(result);
    }

    [HttpPost("bulk-status")]
    public async Task<IActionResult> BulkUpdateStatus([FromBody] BulkStatusRequest request)
    {
        var result = await _recurringService.BulkUpdateStatusAsync(request.Ids, request.IsActive);
        return Ok(result);
    }

    [HttpPost("bulk-delete")]
    public async Task<IActionResult> BulkDelete([FromBody] List<int> ids)
    {
        var result = await _recurringService.BulkDeleteAsync(ids);
        return Ok(result);
    }


}

public class BulkStatusRequest
{
    public List<int> Ids { get; set; } = new();
    public bool IsActive { get; set; }
}
