using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using DormitoryManagement.Data.Context;
using DormitoryManagement.Data.Models;
using DormitoryManagement.Data.DTOs;

namespace DormitoryManagement.Api.Controllers
{
    [Authorize(Roles = "Commandant")]
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationsController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public RegistrationsController(DormitoryManagementContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetRegistrations(int page = 1, int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            var total = _context.Registrations.Count();

            // Отримуємо реєстрації з пагінацією і вручну створюємо DTO
            var registrations = _context.Registrations
                .OrderBy(r => r.RegistrationId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new RegistrationDto
                {
                    RegistrationId = r.RegistrationId,
                    StudentNumber = r.StudentNumber,
                    RoomNumber = r.RoomNumber,
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

        [HttpPost]
        public IActionResult CreateRegistration([FromBody] CreateRegistrationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Вручну створюємо сутність Registration з DTO
            var registration = new Registration
            {
                StudentNumber = dto.StudentNumber,
                RoomNumber = dto.RoomNumber,
                CheckInDate = dto.CheckInDate,
                CheckOutDate = dto.CheckOutDate
            };

            _context.Registrations.Add(registration);
            _context.SaveChanges();

            // Повертаємо DTO у відповіді
            var registrationDto = new RegistrationDto
            {
                RegistrationId = registration.RegistrationId,
                StudentNumber = registration.StudentNumber,
                RoomNumber = registration.RoomNumber,
                CheckInDate = registration.CheckInDate,
                CheckOutDate = registration.CheckOutDate
            };

            return CreatedAtAction(nameof(GetRegistrations), new { id = registration.RegistrationId }, registrationDto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateRegistration(int id, [FromBody] UpdateRegistrationDto dto)
        {
            var registration = _context.Registrations.FirstOrDefault(r => r.RegistrationId == id);
            if (registration == null) return NotFound();

            // Вручну оновлюємо поля сутності з DTO
            registration.StudentNumber = dto.StudentNumber;
            registration.RoomNumber = dto.RoomNumber;
            registration.CheckInDate = dto.CheckInDate;
            registration.CheckOutDate = dto.CheckOutDate;

            _context.SaveChanges();

            // Повертаємо DTO у відповіді
            var registrationDto = new RegistrationDto
            {
                RegistrationId = registration.RegistrationId,
                StudentNumber = registration.StudentNumber,
                RoomNumber = registration.RoomNumber,
                CheckInDate = registration.CheckInDate,
                CheckOutDate = registration.CheckOutDate
            };

            return Ok(registrationDto);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteRegistration(int id)
        {
            var registration = _context.Registrations.FirstOrDefault(r => r.RegistrationId == id);
            if (registration == null)
                return NotFound();

            _context.Registrations.Remove(registration);
            _context.SaveChanges();

            return NoContent();
        }
    }
}