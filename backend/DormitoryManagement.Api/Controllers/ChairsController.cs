using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using DormitoryManagement.Data.Context;
using DormitoryManagement.Data.Models;
using DormitoryManagement.Data.DTOs;

namespace DormitoryManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChairsController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public ChairsController(DormitoryManagementContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Commandant,Castelian,Student")]
        [HttpGet]
        public IActionResult GetChairs(int page = 1, int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            var total = _context.Chairs.Count();

            // Отримуємо стільці з пагінацією і вручну створюємо DTO
            var chairs = _context.Chairs
                .OrderBy(c => c.SerialNumber)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new ChairDto
                {
                    SerialNumber = c.SerialNumber,
                    Condition = c.Condition,
                    Type = c.Type,
                    RoomNumber = c.RoomNumber
                })
                .ToList();

            return Ok(new
            {
                chairs,
                total
            });
        }

        [Authorize(Roles = "Commandant,Castelian")]
        [HttpPost]
        public IActionResult CreateChair([FromBody] CreateChairDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Вручну створюємо сутність Chair з DTO
            var chair = new Chair
            {
                SerialNumber = dto.SerialNumber,
                Condition = dto.Condition,
                Type = dto.Type,
                RoomNumber = dto.RoomNumber
            };

            _context.Chairs.Add(chair);
            _context.SaveChanges();

            // Повертаємо DTO у відповіді
            var chairDto = new ChairDto
            {
                SerialNumber = chair.SerialNumber,
                Condition = chair.Condition,
                Type = chair.Type,
                RoomNumber = chair.RoomNumber
            };

            return CreatedAtAction(nameof(GetChairs), new { serialNumber = chair.SerialNumber }, chairDto);
        }

        [Authorize(Roles = "Commandant,Castelian")]
        [HttpPut("{serialNumber}")]
        public IActionResult UpdateChair(int serialNumber, [FromBody] UpdateChairDto dto)
        {
            var chair = _context.Chairs.FirstOrDefault(c => c.SerialNumber == serialNumber);
            if (chair == null) return NotFound();

            // Вручну оновлюємо поля сутності з DTO
            chair.Condition = dto.Condition;
            chair.Type = dto.Type;
            chair.RoomNumber = dto.RoomNumber;

            _context.SaveChanges();

            // Повертаємо DTO у відповіді
            var chairDto = new ChairDto
            {
                SerialNumber = chair.SerialNumber,
                Condition = chair.Condition,
                Type = chair.Type,
                RoomNumber = chair.RoomNumber
            };

            return Ok(chairDto);
        }

        [Authorize(Roles = "Commandant,Castelian")]
        [HttpDelete("{serialNumber}")]
        public IActionResult DeleteChair(int serialNumber)
        {
            var chair = _context.Chairs.FirstOrDefault(c => c.SerialNumber == serialNumber);
            if (chair == null)
                return NotFound();

            _context.Chairs.Remove(chair);
            _context.SaveChanges();

            return NoContent();
        }
    }
}