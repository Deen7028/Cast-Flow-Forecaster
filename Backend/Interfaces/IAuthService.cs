using Backend.DTOs.Auth;

namespace Backend.Interfaces;

public interface IAuthService
{
    Task<AuthResponse?> LoginAsync(LoginRequest request);
    Task<UserInfoDto?> GetUserProfileAsync(string username);
}
