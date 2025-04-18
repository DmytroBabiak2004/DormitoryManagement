﻿using Microsoft.AspNetCore.Mvc;
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

        [Authorize(Roles = "Student")]
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
        [HttpPost]
        public IActionResult CreateTable([FromBody] CreateTableDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Перевіряємо, чи існує Condition
            var condition = _context.Condition.Find(dto.ConditionId);
            if (condition == null)
                return BadRequest("Invalid ConditionId");

            // Перевіряємо, чи існує Type
            var type = _context.TableTypes.Find(dto.TypeId);
            if (type == null)
                return BadRequest("Invalid TypeId");

            // Створюємо сутність Table
            var table = new Table
            {
               ConditionId = dto.ConditionId, // Встановлюємо зовнішній ключ
                TypeId = dto.TypeId, // Встановлюємо зовнішній ключ
                RoomNumber = dto.RoomNumber
            };

            _context.Tables.Add(table);
            _context.SaveChanges();

            // Повертаємо DTO з повними об'єктами Condition і Type
            var tableDto = new TableDto
            {
                SerialNumber = table.SerialNumber,
                Condition = condition, // Використовуємо завантажений об'єкт
                Type = type, // Використовуємо завантажений об'єкт
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

            // Перевіряємо, чи існує Condition
            var condition = _context.Condition.Find(dto.ConditionId);
            if (condition == null)
                return BadRequest("Invalid ConditionId");

            // Перевіряємо, чи існує Type
            var type = _context.TableTypes.Find(dto.TypeId);
            if (type == null)
                return BadRequest("Invalid TypeId");

            // Оновлюємо поля
            table.ConditionId = dto.ConditionId;
            table.TypeId = dto.TypeId;
            table.RoomNumber = dto.RoomNumber;

            _context.SaveChanges();

            // Повертаємо DTO
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