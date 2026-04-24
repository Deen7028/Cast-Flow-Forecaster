using Backend.DTOs.Auth;
using Backend.Data.Entities;

namespace Backend.Interfaces;

public interface IAuthService
{
    AuthResponse? Login(LoginRequest request);
    UserInfoDto? GetUserProfile(string username);
    tmUsers RegisterUser(tmUsers user);
}
