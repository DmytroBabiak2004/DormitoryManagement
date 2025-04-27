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
    public class RoomsController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public RoomsController(DormitoryManagementContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Commandant,Castelian,Student")]
        [HttpGet]
        public IActionResult GetRooms(int page = 1, int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            var total = _context.Rooms.Count();

            var rooms = _context.Rooms
                .OrderBy(r => r.RoomNumber)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new RoomDto
                {
                    RoomNumber = r.RoomNumber,
                    NumberOfPlaces = r.NumberOfPlaces
                })
                .ToList();

            return Ok(new
            {
                rooms,
                total
            });
        }

        [Authorize(Roles = "Commandant,Castelian,Student")]
        [HttpGet("search")]
        public IActionResult SearchRooms(string query, int page = 1, int pageSize = 10)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return GetRooms(page, pageSize); // If query is empty, return all rooms
            }

            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            // Normalize query to lowercase for case-insensitive search
            var normalizedQuery = query.ToLower();

            // Try to parse query as an integer for NumberOfPlaces
            bool isNumeric = int.TryParse(query, out int numberOfPlaces);

            // Search across RoomNumber and NumberOfPlaces
            var roomsQuery = _context.Rooms
                .Where(r =>
                    r.RoomNumber.ToLower().Contains(normalizedQuery) ||
                    (isNumeric && r.NumberOfPlaces == numberOfPlaces)
                );

            var total = roomsQuery.Count();

            var rooms = roomsQuery
                .OrderBy(r => r.RoomNumber)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new RoomDto
                {
                    RoomNumber = r.RoomNumber,
                    NumberOfPlaces = r.NumberOfPlaces
                })
                .ToList();

            return Ok(new
            {
                rooms,
                total
            });
        }

        [Authorize(Roles = "Commandant")]
        [HttpPost]
        public IActionResult CreateRoom([FromBody] CreateRoomDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var room = new Room
            {
                RoomNumber = dto.RoomNumber,
                NumberOfPlaces = dto.NumberOfPlaces
            };

            _context.Rooms.Add(room);
            _context.SaveChanges();

            var roomDto = new RoomDto
            {
                RoomNumber = room.RoomNumber,
                NumberOfPlaces = room.NumberOfPlaces
            };

            return CreatedAtAction(nameof(GetRooms), new { roomNumber = room.RoomNumber }, roomDto);
        }

        [Authorize(Roles = "Commandant")]
        [HttpPut("{roomNumber}")]
        public IActionResult UpdateRoom(string roomNumber, [FromBody] UpdateRoomDto dto)
        {
            var room = _context.Rooms.FirstOrDefault(r => r.RoomNumber == roomNumber);
            if (room == null) return NotFound();

            room.NumberOfPlaces = dto.NumberOfPlaces;

            _context.SaveChanges();

            var roomDto = new RoomDto
            {
                RoomNumber = room.RoomNumber,
                NumberOfPlaces = room.NumberOfPlaces
            };

            return Ok(roomDto);
        }

        [Authorize(Roles = "Commandant")]
        [HttpDelete("{roomNumber}")]
        public IActionResult DeleteRoom(string roomNumber)
        {
            var room = _context.Rooms.FirstOrDefault(r => r.RoomNumber == roomNumber);
            if (room == null)
                return NotFound();

            _context.Rooms.Remove(room);
            _context.SaveChanges();

            return NoContent();
        }
    }
}