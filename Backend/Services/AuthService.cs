using Backend.DTOs.Auth;
using Backend.Interfaces;
using global::Data.Context;
using Microsoft.EntityFrameworkCore;
using global::Data.Entities;

namespace Backend.Services;

public class AuthService : IAuthService
{
    private readonly WebAppDbContext _context;

    public AuthService(WebAppDbContext context)
    {
        _context = context;
    }

    public AuthResponse? Login(LoginRequest request)
    {
        
        var user = _context.tbUsers
            .FirstOrDefault(u => u.sUsername == request.Username && u.isActive == true);

        if (user == null) return null;

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
                nUsersId = user.nUsersId,
                Username = user.sUsername,
                FullName = user.sFullName ?? "",
                Role = user.sRole
            }
        };
    }

    public UserInfoDto? GetUserProfile(string username)
    {
        var user = _context.tbUsers
            .FirstOrDefault(u => u.sUsername == username && u.isActive == true);

        if (user == null) return null;

        return new UserInfoDto
        {
            nUsersId = user.nUsersId,
            Username = user.sUsername,
            FullName = user.sFullName ?? "",
            Role = user.sRole
        };
    }

    public tbUsers RegisterUser(tbUsers user)
    {
        var objUser = _context.tbUsers.FirstOrDefault(w => w.nUsersId == user.nUsersId);
        if (objUser == null)
        {
            objUser = new tbUsers();
            _context.tbUsers.Add(objUser);
        }

        objUser.sUsername = user.sUsername;
        objUser.sPasswordHash = user.sPasswordHash;
        objUser.sFullName = user.sFullName;
        objUser.sEmail = user.sEmail;
        objUser.sRole = user.sRole;
        objUser.isActive = user.isActive;
        objUser.dCreatedAt = user.dCreatedAt;

        _context.SaveChanges();
        return objUser;
    }
}
