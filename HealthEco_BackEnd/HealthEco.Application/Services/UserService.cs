using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthEco.Core.DTOs;
using HealthEco.Core.DTOs.Admin;
using HealthEco.Core.Entities;
using HealthEco.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HealthEco.Application.Services
{
    public interface IUserService
    {
        Task<UserProfileDto> GetUserProfileAsync(int userId);
        Task<UserProfileDto> UpdateUserProfileAsync(int userId, UpdateProfileRequest request);
        Task ChangePasswordAsync(int userId, ChangePasswordRequest request);
        Task<string> UpdateAvatarAsync(int userId, string avatarUrl);

        // Admin methods
        Task<List<UserListDto>> GetAllUsersAsync();
        Task<UserProfileDto> GetUserByIdAsync(int userId);
        Task<UserProfileDto> UpdateUserStatusAsync(int userId, UpdateUserStatusRequest request);
        Task<UserProfileDto> UpdateUserRoleAsync(int userId, string newRole);
    }

    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordService _passwordService;

        public UserService(IUserRepository userRepository, IPasswordService passwordService)
        {
            _userRepository = userRepository;
            _passwordService = passwordService;
        }

        public async Task<UserProfileDto> GetUserProfileAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            return MapToUserProfileDto(user);
        }

        public async Task<UserProfileDto> UpdateUserProfileAsync(int userId, UpdateProfileRequest request)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            // Update allowed fields
            if (!string.IsNullOrEmpty(request.FullName))
                user.FullName = request.FullName;

            if (!string.IsNullOrEmpty(request.PhoneNumber))
                user.PhoneNumber = request.PhoneNumber;

            if (!string.IsNullOrEmpty(request.DateOfBirth))
                user.DateOfBirth = request.DateOfBirth;

            if (!string.IsNullOrEmpty(request.Address))
                user.Address = request.Address;

            if (!string.IsNullOrEmpty(request.City))
                user.City = request.City;

            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            return MapToUserProfileDto(user);
        }

        public async Task ChangePasswordAsync(int userId, ChangePasswordRequest request)
        {
            if (request.NewPassword != request.ConfirmPassword)
                throw new ArgumentException("New password and confirmation do not match");

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            // Verify current password
            if (!_passwordService.VerifyPassword(request.CurrentPassword, user.PasswordHash))
                throw new UnauthorizedAccessException("Current password is incorrect");

            // Update password
            user.PasswordHash = _passwordService.HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);
        }

        public async Task<string> UpdateAvatarAsync(int userId, string avatarUrl)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            user.AvatarUrl = avatarUrl;
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            return avatarUrl;
        }

        // Admin methods
        public async Task<List<UserListDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(MapToUserListDto).ToList();
        }

        public async Task<UserProfileDto> GetUserByIdAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            return MapToUserProfileDto(user);
        }

        public async Task<UserProfileDto> UpdateUserStatusAsync(int userId, UpdateUserStatusRequest request)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            user.IsActive = request.IsActive;
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            return MapToUserProfileDto(user);
        }

        public async Task<UserProfileDto> UpdateUserRoleAsync(int userId, string newRole)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            // Validate role
            var validRoles = new[] { "Patient", "Doctor", "ClinicAdmin", "SystemAdmin" };
            if (!validRoles.Contains(newRole))
                throw new ArgumentException("Invalid role");

            user.Role = newRole;
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            return MapToUserProfileDto(user);
        }

        // Helper methods
        private UserProfileDto MapToUserProfileDto(User user)
        {
            return new UserProfileDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                PhoneNumber = user.PhoneNumber,
                AvatarUrl = user.AvatarUrl,
                DateOfBirth = user.DateOfBirth,
                Address = user.Address,
                City = user.City,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }

        private UserListDto MapToUserListDto(User user)
        {
            return new UserListDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                PhoneNumber = user.PhoneNumber,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }
    }
}