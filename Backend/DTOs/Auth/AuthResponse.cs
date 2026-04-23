namespace Backend.DTOs.Auth;

public class AuthResponse
{
    public string Token { get; set; } = null!;
    public UserInfoDto User { get; set; } = null!;
}

public class UserInfoDto
{
    public int Id { get; set; }
    public string Username { get; set; } = null!;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = null!;
}
