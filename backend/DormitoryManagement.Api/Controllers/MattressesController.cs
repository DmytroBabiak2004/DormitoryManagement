using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using DormitoryManagement.Data.Context;
using DormitoryManagement.Data.Models;
using DormitoryManagement.Data.DTOs;

namespace DormitoryManagement.Api.Controllers
{
    [Authorize(Roles = "Commandant,Castelian")]
    [ApiController]
    [Route("api/[controller]")]
    public class MattressesController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public MattressesController(DormitoryManagementContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Commandant,Castelian,Student")]
        [HttpGet]
        public IActionResult GetMattresses(int page = 1, int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            var total = _context.Mattresses.Count();

            // Отримуємо матраци з пагінацією і вручну створюємо DTO
            var mattresses = _context.Mattresses
                .OrderBy(m => m.SerialNumber)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new MattressDto
                {
                    SerialNumber = m.SerialNumber,
                    Condition = m.Condition,
                    Type = m.Type,
                    StudentNumber = m.StudentNumber
                })
                .ToList();

            return Ok(new
            {
                mattresses,
                total
            });
        }

        [Authorize(Roles = "Commandant,Castelian")]
        [HttpPost]
        public IActionResult CreateMattress([FromBody] CreateMattressDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Вручну створюємо сутність Mattress з DTO
            var mattress = new Mattress
            {
                SerialNumber = dto.SerialNumber,
                Condition = dto.Condition,
                Type = dto.Type,
                StudentNumber = dto.StudentNumber
            };

            _context.Mattresses.Add(mattress);
            _context.SaveChanges();

            // Повертаємо DTO у відповіді
            var mattressDto = new MattressDto
            {
                SerialNumber = mattress.SerialNumber,
                Condition = mattress.Condition,
                Type = mattress.Type,
                StudentNumber = mattress.StudentNumber
            };

            return CreatedAtAction(nameof(GetMattresses), new { serialNumber = mattress.SerialNumber }, mattressDto);
        }

        [Authorize(Roles = "Commandant,Castelian")]
        [HttpPut("{serialNumber}")]
        public IActionResult UpdateMattress(int serialNumber, [FromBody] UpdateMattressDto dto)
        {
            var mattress = _context.Mattresses.FirstOrDefault(m => m.SerialNumber == serialNumber);
            if (mattress == null) return NotFound();

            // Вручну оновлюємо поля сутності з DTO
            mattress.Condition = dto.Condition;
            mattress.Type = dto.Type;
            mattress.StudentNumber = dto.StudentNumber;

            _context.SaveChanges();

            // Повертаємо DTO у відповіді
            var mattressDto = new MattressDto
            {
                SerialNumber = mattress.SerialNumber,
                Condition = mattress.Condition,
                Type = mattress.Type,
                StudentNumber = mattress.StudentNumber
            };

            return Ok(mattressDto);
        }

        [Authorize(Roles = "Commandant,Castelian")]
        [HttpDelete("{serialNumber}")]
        public IActionResult DeleteMattress(int serialNumber)
        {
            var mattress = _context.Mattresses.FirstOrDefault(m => m.SerialNumber == serialNumber);
            if (mattress == null)
                return NotFound();

            _context.Mattresses.Remove(mattress);
            _context.SaveChanges();

            return NoContent();
        }
    }
}