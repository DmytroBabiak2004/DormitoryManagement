using Microsoft.AspNetCore.Mvc;
using DormitoryManagement.Data.Context;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace DormitoryManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsInRoomController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public StudentsInRoomController(DormitoryManagementContext context)
        {
            _context = context;
        }

        [HttpGet("{roomNumber}")]
        public async Task<IActionResult> GetStudentsInRoom(string roomNumber)
        {
            try
            {
                var studentsList = new List<object>();

                using (var connection = _context.Database.GetDbConnection())
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "get_students_in_room";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.Add(new SqlParameter("@input_room_number", roomNumber));

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (!reader.HasRows)
                            {
                                return Ok(new
                                {
                                    status = "success",
                                    message = $"No students found in room {roomNumber}",
                                    data = studentsList
                                });
                            }

                            while (await reader.ReadAsync())
                            {
                                studentsList.Add(new
                                {
                                    StudentNumber = reader.GetString(reader.GetOrdinal("StudentNumber")),
                                    FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                                    LastName = reader.GetString(reader.GetOrdinal("LastName"))
                                });
                            }
                        }
                    }
                }

                return Ok(new
                {
                    status = "success",
                    data = studentsList
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = "Error retrieving students data", message = ex.Message });
            }
        }
    }
}