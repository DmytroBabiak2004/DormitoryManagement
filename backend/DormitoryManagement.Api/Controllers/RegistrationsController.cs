using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using DormitoryManagement.Data.Context;
using DormitoryManagement.Data.Models;
using DormitoryManagement.Data.DTOs;
using DormitoryManagement.Data.DTOs.DormitoryManagement.Api.Dtos;

namespace DormitoryManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationsController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public RegistrationsController(DormitoryManagementContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Commandant")]
        [HttpGet]
        public IActionResult GetRegistrations(int page = 1, int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            var total = _context.Registrations.Count();

            var registrations = _context.Registrations
                .OrderBy(r => r.RegistrationId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new RegistrationDto
                {
                    RegistrationId = r.RegistrationId,
                    RoomNumber = r.RoomNumber,
                    StudentNumber = r.StudentNumber,
                    CheckInDate = r.CheckInDate,
                    CheckOutDate = r.CheckOutDate
                })
                .ToList();

            return Ok(new
            {
                registrations,
                total
            });
        }

        [Authorize(Roles = "Commandant")]
        [HttpGet("search")]
        public IActionResult SearchRegistrations(string query, int page = 1, int pageSize = 10)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return GetRegistrations(page, pageSize); // If query is empty, return all registrations
            }

            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            // Normalize query to lowercase for case-insensitive search
            var normalizedQuery = query.ToLower();

            // Search across multiple fields
            var registrationsQuery = _context.Registrations
                .Where(r =>
                    r.RegistrationId.ToString().Contains(normalizedQuery) ||
                    r.RoomNumber.ToLower().Contains(normalizedQuery) ||
                    r.StudentNumber.ToLower().Contains(normalizedQuery)
                );

            var total = registrationsQuery.Count();

            var registrations = registrationsQuery
                .OrderBy(r => r.RegistrationId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new RegistrationDto
                {
                    RegistrationId = r.RegistrationId,
                    RoomNumber = r.RoomNumber,
                    StudentNumber = r.StudentNumber,
                    CheckInDate = r.CheckInDate,
                    CheckOutDate = r.CheckOutDate
                })
                .ToList();

            return Ok(new
            {
                registrations,
                total
            });
        }

        [Authorize(Roles = "Commandant")]
        [HttpPost]
        public IActionResult CreateRegistration([FromBody] CreateRegistrationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var roomExists = _context.Rooms.Any(r => r.RoomNumber == dto.RoomNumber);
            if (!roomExists)
            {
                return BadRequest($"Room with number {dto.RoomNumber} does not exist.");
            }

            var registration = new Registration
            {
                RoomNumber = dto.RoomNumber,
                StudentNumber = dto.StudentNumber,
                CheckInDate = dto.CheckInDate,
                CheckOutDate = dto.CheckOutDate
            };

            _context.Registrations.Add(registration);
            _context.SaveChanges();

            var registrationDto = new RegistrationDto
            {
                RegistrationId = registration.RegistrationId,
                RoomNumber = registration.RoomNumber,
                StudentNumber = registration.StudentNumber,
                CheckInDate = registration.CheckInDate,
                CheckOutDate = registration.CheckOutDate
            };

            return CreatedAtAction(nameof(GetRegistrations), new { RegistrationId = registration.RegistrationId }, registrationDto);
        }

        [Authorize(Roles = "Commandant")]
        [HttpPut("{registrationId}")]
        public IActionResult UpdateRegistration(int registrationId, [FromBody] UpdateRegistrationDto dto)
        {
            var registration = _context.Registrations.FirstOrDefault(r => r.RegistrationId == registrationId);
            if (registration == null) return NotFound();

            registration.RoomNumber = dto.RoomNumber;
            registration.StudentNumber = dto.StudentNumber;
            registration.CheckInDate = dto.CheckInDate;
            registration.CheckOutDate = dto.CheckOutDate;

            _context.SaveChanges();

            var registrationDto = new RegistrationDto
            {
                RegistrationId = registration.RegistrationId,
                RoomNumber = registration.RoomNumber,
                StudentNumber = registration.StudentNumber,
                CheckInDate = registration.CheckInDate,
                CheckOutDate = registration.CheckOutDate
            };

            return Ok(registrationDto);
        }

        [Authorize(Roles = "Commandant")]
        [HttpDelete("{registrationId}")]
        public IActionResult DeleteRegistration(int registrationId)
        {
            var registration = _context.Registrations.FirstOrDefault(r => r.RegistrationId == registrationId);
            if (registration == null)
                return NotFound();

            _context.Registrations.Remove(registration);
            _context.SaveChanges();

            return NoContent();
        }
    }
}