using Backend.DTOs.Auth;
using global::Data.Entities;

namespace Backend.Interfaces;

public interface IAuthService
{
    AuthResponse? Login(LoginRequest request);
    UserInfoDto? GetUserProfile(string username);
    tbUsers RegisterUser(tbUsers user);
}
