using Microsoft.AspNetCore.Mvc;
using DormitoryManagement.Data.Context;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace DormitoryManagement.Api.Controllers
{
    [Authorize(Roles = "Commandant,Castelian")]
    [ApiController]
    [Route("api/[controller]")]
    public class FurnitureController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public FurnitureController(DormitoryManagementContext context)
        {
            _context = context;
        }

        [HttpGet("{roomNumber}")]
        public async Task<IActionResult> GetFurnitureInRoom(string roomNumber)
        {
            try
            {
                var furnitureList = new List<object>();

                using (var connection = _context.Database.GetDbConnection())
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "get_furniture_in_room";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.Add(new SqlParameter("@input_room_number", roomNumber));

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (!reader.HasRows)
                            {
                                return Ok(new
                                {
                                    status = "success",
                                    message = $"No furniture found for room {roomNumber}",
                                    data = furnitureList
                                });
                            }

                            while (await reader.ReadAsync())
                            {
                                // Переконуємося, що читаємо всі колонки
                                var furnitureItem = new
                                {
                                    FurnitureType = reader.GetString(reader.GetOrdinal("FurnitureType")),
                                    SerialNumber = reader.GetValue(reader.GetOrdinal("SerialNumber")),
                                    Type = reader.GetString(reader.GetOrdinal("Type")),
                                    Condition = reader.GetString(reader.GetOrdinal("Condition"))
                                };
                                furnitureList.Add(furnitureItem);
                            }
                        }
                    }
                }

                return Ok(new
                {
                    status = "success",
                    data = furnitureList
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = "Error retrieving furniture data", message = ex.Message });
            }
        }
    }
}