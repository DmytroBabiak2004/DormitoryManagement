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

            // Перевіряємо, чи існує Condition
            var condition = _context.Condition.Find(dto.ConditionId);
            if (condition == null)
                return BadRequest("Invalid ConditionId");

            // Перевіряємо, чи існує Type
            var type = _context.ChairTypes.Find(dto.TypeId);
            if (type == null)
                return BadRequest("Invalid TypeId");

            // Створюємо сутність Chair
            var chair = new Chair
            {
                ConditionId = dto.ConditionId, // Встановлюємо зовнішній ключ
                TypeId = dto.TypeId, // Встановлюємо зовнішній ключ
                RoomNumber = dto.RoomNumber
            };

            _context.Chairs.Add(chair);
            _context.SaveChanges();

            // Повертаємо DTO з повними об'єктами Condition і Type
            var chairDto = new ChairDto
            {
                SerialNumber = chair.SerialNumber,
                Condition = condition, // Використовуємо завантажений об'єкт
                Type = type, // Використовуємо завантажений об'єкт
                RoomNumber = chair.RoomNumber
    };

            return CreatedAtAction(nameof(GetChairs), new { serialNumber = chair.SerialNumber }, chairDto);
        }

        [Authorize(Roles = "Commandant,Castelian")]
        [HttpPut("{serialNumber}")]
        public IActionResult UpdateChair(int serialNumber, [FromBody] UpdateChairDto dto)
        {
            var chair = _context.Chairs
                .Include(c => c.Condition)
                .Include(c => c.Type)
                .FirstOrDefault(c => c.SerialNumber == serialNumber);
            if (chair == null)
                return NotFound();

            // Перевіряємо, чи існує Condition
            var condition = _context.Condition.Find(dto.ConditionId);
            if (condition == null)
                return BadRequest("Invalid ConditionId");

            // Перевіряємо, чи існує Type
            var type = _context.ChairTypes.Find(dto.TypeId);
            if (type == null)
                return BadRequest("Invalid TypeId");

            // Оновлюємо поля
            chair.ConditionId = dto.ConditionId;
            chair.TypeId = dto.TypeId;
            chair.RoomNumber = dto.RoomNumber;

            _context.SaveChanges();

            // Повертаємо DTO
            var chairDto = new ChairDto
            {
                SerialNumber = chair.SerialNumber,
                Condition = condition,
                Type = type,
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