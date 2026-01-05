using HealthEco.Core.DTOs;

namespace HealthEco.Core.DTOs.AuthDto
{
    public class AuthResponse : BaseResponse
    {
        public AuthData? Data { get; set; }
    }

    public class AuthData
    {
        public string Token { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
        public UserDto User { get; set; } = null!;
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public string? AvatarUrl { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public bool IsActive { get; set; }
        public bool IsEmailVerified { get; set; }
        public string? ThemePreference { get; set; }
        public string? LanguagePreference { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ActivityLogDto
    {
        public string Action { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public string? Location { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}