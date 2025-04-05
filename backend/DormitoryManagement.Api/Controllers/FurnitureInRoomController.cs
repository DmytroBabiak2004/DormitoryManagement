using Microsoft.AspNetCore.Mvc;
using DormitoryManagement.Data.Context;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace DormitoryManagement.Api.Controllers
{
   
    [ApiController]
    [Route("api/[controller]")]
    public class FurnitureController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public FurnitureController(DormitoryManagementContext context)
        {
            _context = context;
        }
        [Authorize(Roles = "Commandant,Castelian")]
        [HttpGet("{roomNumber}")]
        public async Task<IActionResult> GetFurnitureInRoom(string roomNumber, int page = 1, int pageSize = 10)
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
                            while (await reader.ReadAsync())
                            {
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

                var total = furnitureList.Count;
                if (page < 1) page = 1;
                if (pageSize < 1) pageSize = 10;

                var paginatedFurniture = furnitureList
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                return Ok(new
                {
                    status = "success",
                    data = paginatedFurniture,
                    total,
                    currentPage = page,
                    pageSize
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = "Error retrieving furniture data", message = ex.Message });
            }
        }
    }
}