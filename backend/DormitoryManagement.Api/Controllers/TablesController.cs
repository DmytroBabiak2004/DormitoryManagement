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
    public class TablesController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public TablesController(DormitoryManagementContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Commandant,Castelian")]
        [HttpGet]
        public IActionResult GetTables(int page = 1, int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            var total = _context.Tables.Count();

            var tables = _context.Tables
                .OrderBy(t => t.SerialNumber)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new TableDto
                {
                    SerialNumber = t.SerialNumber,
                    Condition = t.Condition,
                    Type = t.Type,
                    RoomNumber = t.RoomNumber
                })
                .ToList();

            return Ok(new
            {
                tables,
                total
            });
        }

        [Authorize(Roles = "Commandant,Castelian")]
        [HttpGet("search")]
        public IActionResult SearchTables(string query, int page = 1, int pageSize = 10)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return GetTables(page, pageSize); // If query is empty, return all tables
            }

            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            // Normalize query to lowercase for case-insensitive search
            var normalizedQuery = query.ToLower();

            // Search across multiple fields
            var tablesQuery = _context.Tables
                .Include(t => t.Condition)
                .Include(t => t.Type)
                .Where(t =>
                    t.SerialNumber.ToString().Contains(normalizedQuery) ||
                    t.Condition.NameOfCondition.ToLower().Contains(normalizedQuery) ||
                    t.Type.NameOfTableType.ToLower().Contains(normalizedQuery) ||
                    t.RoomNumber.ToLower().Contains(normalizedQuery)
                );

            var total = tablesQuery.Count();

            var tables = tablesQuery
                .OrderBy(t => t.SerialNumber)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new TableDto
                {
                    SerialNumber = t.SerialNumber,
                    Condition = t.Condition,
                    Type = t.Type,
                    RoomNumber = t.RoomNumber
                })
                .ToList();

            return Ok(new
            {
                tables,
                total
            });
        }

        [Authorize(Roles = "Commandant,Castelian")]
        [HttpPost]
        public IActionResult CreateTable([FromBody] CreateTableDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var condition = _context.Condition.Find(dto.ConditionId);
            if (condition == null)
                return BadRequest("Invalid ConditionId");

            var type = _context.TableTypes.Find(dto.TypeId);
            if (type == null)
                return BadRequest("Invalid TypeId");

            var table = new Table
            {
                ConditionId = dto.ConditionId,
                TypeId = dto.TypeId,
                RoomNumber = dto.RoomNumber
            };

            _context.Tables.Add(table);
            _context.SaveChanges();

            var tableDto = new TableDto
            {
                SerialNumber = table.SerialNumber,
                Condition = condition,
                Type = type,
                RoomNumber = table.RoomNumber
            };

            return CreatedAtAction(nameof(GetTables), new { serialNumber = table.SerialNumber }, tableDto);
        }

        [Authorize(Roles = "Commandant,Castelian")]
        [HttpPut("{serialNumber}")]
        public IActionResult UpdateTable(int serialNumber, [FromBody] UpdateTableDto dto)
        {
            var table = _context.Tables
                .Include(t => t.Condition)
                .Include(t => t.Type)
                .FirstOrDefault(t => t.SerialNumber == serialNumber);
            if (table == null)
                return NotFound();

            var condition = _context.Condition.Find(dto.ConditionId);
            if (condition == null)
                return BadRequest("Invalid ConditionId");

            var type = _context.TableTypes.Find(dto.TypeId);
            if (type == null)
                return BadRequest("Invalid TypeId");

            table.ConditionId = dto.ConditionId;
            table.TypeId = dto.TypeId;
            table.RoomNumber = dto.RoomNumber;

            _context.SaveChanges();

            var tableDto = new TableDto
            {
                SerialNumber = table.SerialNumber,
                Condition = condition,
                Type = type,
                RoomNumber = table.RoomNumber
            };

            return Ok(tableDto);
        }

        [Authorize(Roles = "Commandant,Castelian")]
        [HttpDelete("{serialNumber}")]
        public IActionResult DeleteTable(int serialNumber)
        {
            var table = _context.Tables.FirstOrDefault(t => t.SerialNumber == serialNumber);
            if (table == null)
                return NotFound();

            _context.Tables.Remove(table);
            _context.SaveChanges();

            return NoContent();
        }
    }
}