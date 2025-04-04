﻿using Microsoft.AspNetCore.Mvc;
using DormitoryManagement.Data.Context;
using DormitoryManagement.Data.Models;
using Microsoft.AspNetCore.Authorization;

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
        public IActionResult GetRooms()
        {
            var rooms = _context.Rooms
                .Select(r => new
                {
                    r.RoomNumber,
                    r.NumberOfPlaces
                })
                .ToList();

            return Ok(rooms);
        }

        [Authorize(Roles = "Commandant")]
        [HttpPost]
        public IActionResult CreateRoom([FromBody] Room room)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Rooms.Add(room);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetRooms), new { roomNumber = room.RoomNumber }, room);
        }

        [Authorize(Roles = "Commandant")]
        [HttpDelete("{RoomNumber}")]
        public IActionResult DeleteRoom(int RoomNumber)
        {
            var room = _context.Rooms.Find(RoomNumber);
            if (room == null)
                return NotFound();

            _context.Rooms.Remove(room);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
