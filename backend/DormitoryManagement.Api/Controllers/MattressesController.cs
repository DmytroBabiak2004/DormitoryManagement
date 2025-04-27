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
    public class MattressesController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public MattressesController(DormitoryManagementContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Commandant,Castelian")]
        [HttpGet]
        public IActionResult GetMattresses(int page = 1, int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            var total = _context.Mattresses.Count();

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
        [HttpGet("search")]
        public IActionResult SearchMattresses(string query, int page = 1, int pageSize = 10)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return GetMattresses(page, pageSize); // If query is empty, return all mattresses
            }

            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            // Normalize query to lowercase for case-insensitive search
            var normalizedQuery = query.ToLower();

            // Search across multiple fields
            var mattressesQuery = _context.Mattresses
                .Include(m => m.Condition)
                .Include(m => m.Type)
                .Where(m =>
                    m.SerialNumber.ToString().Contains(normalizedQuery) ||
                    m.Condition.NameOfCondition.ToLower().Contains(normalizedQuery) ||
                    m.Type.NameOfMattressType.ToLower().Contains(normalizedQuery) ||
                    m.StudentNumber.ToLower().Contains(normalizedQuery)
                );

            var total = mattressesQuery.Count();

            var mattresses = mattressesQuery
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

            var condition = _context.Condition.Find(dto.ConditionId);
            if (condition == null)
                return BadRequest("Invalid ConditionId");

            var type = _context.MattressTypes.Find(dto.TypeId);
            if (type == null)
                return BadRequest("Invalid TypeId");

            var mattress = new Mattress
            {
                ConditionId = dto.ConditionId,
                TypeId = dto.TypeId,
                StudentNumber = dto.StudentNumber
            };

            _context.Mattresses.Add(mattress);
            _context.SaveChanges();

            var mattressDto = new MattressDto
            {
                SerialNumber = mattress.SerialNumber,
                Condition = condition,
                Type = type,
                StudentNumber = mattress.StudentNumber
            };

            return CreatedAtAction(nameof(GetMattresses), new { serialNumber = mattress.SerialNumber }, mattressDto);
        }

        [Authorize(Roles = "Commandant,Castelian")]
        [HttpPut("{serialNumber}")]
        public IActionResult UpdateMattress(int serialNumber, [FromBody] UpdateMattressDto dto)
        {
            var mattress = _context.Mattresses
                .Include(m => m.Condition)
                .Include(m => m.Type)
                .FirstOrDefault(m => m.SerialNumber == serialNumber);
            if (mattress == null)
                return NotFound();

            var condition = _context.Condition.Find(dto.ConditionId);
            if (condition == null)
                return BadRequest("Invalid ConditionId");

            var type = _context.MattressTypes.Find(dto.TypeId);
            if (type == null)
                return BadRequest("Invalid TypeId");

            mattress.ConditionId = dto.ConditionId;
            mattress.TypeId = dto.TypeId;
            mattress.StudentNumber = dto.StudentNumber;

            _context.SaveChanges();

            var mattressDto = new MattressDto
            {
                SerialNumber = mattress.SerialNumber,
                Condition = condition,
                Type = type,
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