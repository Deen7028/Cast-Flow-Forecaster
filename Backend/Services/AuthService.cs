using Backend.DTOs.Auth;
using Backend.Interfaces;
using Backend.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class AuthService : IAuthService
{
    private readonly WebAppDbContext _context;

    public AuthService(WebAppDbContext context)
    {
        _context = context;
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        // 1. หา User จาก Username
        var user = await _context.tmUsers
            .FirstOrDefaultAsync(u => u.sUsername == request.Username && u.isActive == true);

        if (user == null) return null;

        // 2. ตรวจสอบ Password (ในอนาคตควรใช้ BCrypt หรือ Identity PasswordHasher)
        // สมมติว่าตอนนี้เทียบตรงๆ หรือคุณอาจจะมี Logic การ Hash อยู่แล้ว
        if (user.sPasswordHash != request.Password) 
        {
            return null;
        }

        // 3. ถ้าผ่าน ให้สร้าง Response (ในอนาคตจะรวมการสร้าง JWT Token ที่นี่)
        return new AuthResponse
        {
            Token = "mock-jwt-token-for-now", // TODO: Implement JWT
            User = new UserInfoDto
            {
                Id = user.nId,
                Username = user.sUsername,
                FullName = user.sFullName ?? "",
                Role = user.sRole
            }
        };
    }
}
