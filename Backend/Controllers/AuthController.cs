using Backend.DTOs.Auth;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using global::Data.Entities;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _objAuthService;
    public AuthController(IAuthService objAuthService)
    {
        _objAuthService = objAuthService;
    }
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest objRequest)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var objResult = _objAuthService.Login(objRequest);

        if (objResult == null)
        {
            return Unauthorized(new { status = "error", message = "Username หรือ Password ไม่ถูกต้อง" });
        }

        return Ok(new { status = "success", data = objResult });
    }

    [HttpGet("profile")]
    public IActionResult GetProfile([FromQuery] string sUsername)
    {
        var objUser = _objAuthService.GetUserProfile(sUsername);
        if (objUser == null)
        {
            return NotFound(new { status = "error", message = "ไม่พบข้อมูลผู้ใช้งาน" });
        }
        return Ok(new { status = "success", data = objUser });
    }

    [HttpPost]
    public ActionResult<tbUsers> PostUser(tbUsers objUser)
    {
        var objResult = _objAuthService.RegisterUser(objUser);
        return CreatedAtAction(nameof(GetProfile), new { id = objResult.nUsersId }, new { status = "success", data = objResult });
    } 
}
