using System;

namespace HealthEco.Core.DTOs.Admin
{
    public class UserListDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? DoctorId { get; set; }
        public string DoctorSpecialization { get; set; }
    }

    public class UpdateUserStatusRequest
    {
        public bool IsActive { get; set; }
        public string Reason { get; set; }
    }
}