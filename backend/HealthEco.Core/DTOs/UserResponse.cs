namespace HealthEco.Core.DTOs
{
    public class UserResponse
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? AvatarUrl { get; set; }
        public bool IsActive { get; set; }
        public bool IsEmailVerified { get; set; }
        public string? ThemePreference { get; set; }
        public string? LanguagePreference { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}