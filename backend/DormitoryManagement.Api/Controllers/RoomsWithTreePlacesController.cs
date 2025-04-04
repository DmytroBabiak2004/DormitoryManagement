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
        public async Task<IActionResult> GetRoomsWithFreePlaces()
        {
            try
            {
                var roomsList = new List<object>();

                using (var connection = _context.Database.GetDbConnection())
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "get_rooms_with_free_places";
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (!reader.HasRows)
                            {
                                return Ok(new
                                {
                                    status = "success",
                                    message = "No rooms with free places found",
                                    data = roomsList
                                });
                            }

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

                return Ok(new
                {
                    status = "success",
                    data = roomsList
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = "Error retrieving rooms data", message = ex.Message });
            }
        }
    }
}