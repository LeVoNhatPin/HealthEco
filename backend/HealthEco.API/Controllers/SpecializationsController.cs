// HealthEco.API/Controllers/SpecializationsController.cs
using HealthEco.Core.DTOs.Doctor;
using HealthEco.Core.Entities;
using HealthEco.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HealthEco.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecializationsController : BaseController
    {
        private readonly ApplicationDbContext _context;

        // Sửa constructor
        public SpecializationsController(
            ApplicationDbContext context,
            ILogger<SpecializationsController> logger) : base(logger)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetSpecializations()
        {
            try
            {
                var specializations = await _context.Specializations
                    .Where(s => s.IsActive)
                    .Select(s => new SpecializationResponse
                    {
                        Id = s.Id,
                        Name = s.Name,
                        Description = s.Description,
                        IconUrl = s.IconUrl,
                        IsActive = s.IsActive
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = specializations });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting specializations");
                return StatusCode(500, new { message = $"Lỗi server: {ex.Message}" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "SystemAdmin")]
        public async Task<IActionResult> CreateSpecialization([FromBody] SpecializationCreateRequest request)
        {
            try
            {
                var existingSpec = await _context.Specializations
                    .FirstOrDefaultAsync(s => s.Name.ToLower() == request.Name.ToLower());

                if (existingSpec != null)
                {
                    return BadRequest(new { message = "Tên chuyên khoa đã tồn tại" });
                }

                var specialization = new Specialization
                {
                    Name = request.Name,
                    Description = request.Description ?? string.Empty,
                    IconUrl = request.IconUrl ?? string.Empty,
                    IsActive = request.IsActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Specializations.Add(specialization);
                await _context.SaveChangesAsync();

                var response = new SpecializationResponse
                {
                    Id = specialization.Id,
                    Name = specialization.Name,
                    Description = specialization.Description,
                    IconUrl = specialization.IconUrl,
                    IsActive = specialization.IsActive
                };

                return Ok(new { success = true, data = response, message = "Tạo chuyên khoa thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating specialization");
                return StatusCode(500, new { message = $"Lỗi server: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SystemAdmin")]
        public async Task<IActionResult> UpdateSpecialization(int id, [FromBody] SpecializationUpdateRequest request)
        {
            try
            {
                var specialization = await _context.Specializations.FindAsync(id);

                if (specialization == null)
                {
                    return NotFound(new { message = "Không tìm thấy chuyên khoa" });
                }

                if (request.Name != specialization.Name)
                {
                    var existingSpec = await _context.Specializations
                        .FirstOrDefaultAsync(s => s.Name.ToLower() == request.Name.ToLower() && s.Id != id);

                    if (existingSpec != null)
                    {
                        return BadRequest(new { message = "Tên chuyên khoa đã tồn tại" });
                    }
                }

                specialization.Name = request.Name;
                specialization.Description = request.Description ?? string.Empty;
                specialization.IconUrl = request.IconUrl ?? string.Empty;
                specialization.IsActive = request.IsActive;
                specialization.UpdatedAt = DateTime.UtcNow;

                _context.Specializations.Update(specialization);
                await _context.SaveChangesAsync();

                var response = new SpecializationResponse
                {
                    Id = specialization.Id,
                    Name = specialization.Name,
                    Description = specialization.Description,
                    IconUrl = specialization.IconUrl,
                    IsActive = specialization.IsActive
                };

                return Ok(new { success = true, data = response, message = "Cập nhật chuyên khoa thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating specialization with id {id}");
                return StatusCode(500, new { message = $"Lỗi server: {ex.Message}" });
            }
        }
    }

    public class SpecializationCreateRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? IconUrl { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class SpecializationUpdateRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? IconUrl { get; set; }
        public bool IsActive { get; set; }
    }
}