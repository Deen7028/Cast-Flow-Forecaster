using Backend.DTOs.Auth;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.LoginAsync(request);

        if (result == null)
        {
            return Unauthorized(new { message = "Username หรือ Password ไม่ถูกต้อง" });
        }

        return Ok(result);
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile([FromQuery] string username)
    {
        var user = await _authService.GetUserProfileAsync(username);
        if (user == null)
        {
            return NotFound(new { message = "ไม่พบข้อมูลผู้ใช้งาน" });
        }
        return Ok(user);
    }
}
