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
        try
        {
            var user = _context.tbUsers
                .FirstOrDefault(u => u.sUsername == request.Username && u.isActive == true);

            if (user == null) 
            {
                Console.WriteLine($"Login failed: User {request.Username} not found.");
                return null;
            }

            if (user.sPasswordHash != request.Password)
            {
                Console.WriteLine($"Login failed: Incorrect password for user {request.Username}.");
                return null;
            }

            return new AuthResponse
            {
                Token = "mock-jwt-token-for-now",
                User = new UserInfoDto
                {
                    nUsersId = user.nUsersId,
                    Username = user.sUsername,
                    FullName = user.sFullName ?? "",
                    Role = user.sRole
                }
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR in Login: {ex.Message}");
            if (ex.InnerException != null)
            {
                Console.WriteLine($"INNER ERROR: {ex.InnerException.Message}");
            }
            throw; // Re-throw to keep the 500 for now but log the cause
        }
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
