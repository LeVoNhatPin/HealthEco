using System.ComponentModel.DataAnnotations;
using HealthEco.Core.DTOs;

namespace HealthEco.Core.DTOs.Auth
{
    // ==================== REQUEST MODELS ====================
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        public required string Password { get; set; }

        [Required(ErrorMessage = "Xác nhận mật khẩu là bắt buộc")]
        [Compare("Password", ErrorMessage = "Mật khẩu không khớp")]
        public required string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Họ tên là bắt buộc")]
        public required string FullName { get; set; }

        [Required(ErrorMessage = "Vai trò là bắt buộc")]
        public required string Role { get; set; }

        public string? PhoneNumber { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
    }

    public class LoginRequest
    {
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        public string Password { get; set; } = null!;

        public bool RememberMe { get; set; } = false;
    }

    public class RefreshTokenRequest
    {
        public string Token { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
    }

    public class ForgotPasswordRequest
    {
        public string Email { get; set; } = null!;
    }

    public class ResetPasswordRequest
    {
        public string Token { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }

    // ==================== RESPONSE MODELS ====================
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