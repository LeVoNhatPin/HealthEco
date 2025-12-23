using System;

namespace HealthEco.Core.DTOs
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
        public string PhoneNumber { get; set; }
        public string AvatarUrl { get; set; }
        public string? DateOfBirth { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class UpdateProfileRequest
    {
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string? DateOfBirth { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
}