using Backend.DTOs.Auth;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Backend.Data.Entities;

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
    public IActionResult Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = _authService.Login(request);

        if (result == null)
        {
            return Unauthorized(new { message = "Username หรือ Password ไม่ถูกต้อง" });
        }

        return Ok(result);
    }

    [HttpGet("profile")]
    public IActionResult GetProfile([FromQuery] string username)
    {
        var user = _authService.GetUserProfile(username);
        if (user == null)
        {
            return NotFound(new { message = "ไม่พบข้อมูลผู้ใช้งาน" });
        }
        return Ok(user);
    }

    [HttpPost]
    public ActionResult<tmUsers> PostUser(tmUsers user)
    {
        var result = _authService.RegisterUser(user);
        return CreatedAtAction(nameof(GetProfile), new { id = result.nId }, result);
    } 
}
