using Microsoft.AspNetCore.Mvc;
using DormitoryManagement.Data.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace DormitoryManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsWithFreePlacesController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public RoomsWithFreePlacesController(DormitoryManagementContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Commandant,Castelian,Student")]
        [HttpGet]
        public async Task<IActionResult> GetRoomsWithFreePlaces(int page = 1, int pageSize = 10)
        {
            try
            {
                var roomsList = new List<object>();

                // Отримуємо всі дані з процедури
                using (var connection = _context.Database.GetDbConnection())
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "get_rooms_with_free_places";
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var roomItem = new
                                {
                                    RoomNumber = reader.GetString(reader.GetOrdinal("RoomNumber")),
                                    TotalPlaces = reader.GetInt32(reader.GetOrdinal("TotalPlaces")),
                                    OccupiedPlaces = reader.GetInt32(reader.GetOrdinal("OccupiedPlaces")),
                                    FreePlaces = reader.GetInt32(reader.GetOrdinal("FreePlaces"))
                                };
                                roomsList.Add(roomItem);
                            }
                        }
                    }
                }

                // Реалізуємо пагінацію на рівні C#
                var total = roomsList.Count;
                if (page < 1) page = 1;
                if (pageSize < 1) pageSize = 10;

                var paginatedRooms = roomsList
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                if (!paginatedRooms.Any())
                {
                    return Ok(new
                    {
                        status = "success",
                        message = "No rooms with free places found for this page",
                        data = paginatedRooms,
                        total,
                        currentPage = page,
                        pageSize
                    });
                }

                return Ok(new
                {
                    status = "success",
                    data = paginatedRooms,
                    total,
                    currentPage = page,
                    pageSize
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = "Error retrieving rooms data", message = ex.Message });
            }
        }
    }
}