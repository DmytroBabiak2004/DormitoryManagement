using Microsoft.AspNetCore.Mvc;
using DormitoryManagement.Data.Context;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

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
        [Authorize(Roles = "Commandant,Castelian")]
        [HttpGet("{roomNumber}")]
        public async Task<IActionResult> GetStudentsInRoom(string roomNumber, int page = 1, int pageSize = 10)
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

                var total = studentsList.Count;
                if (page < 1) page = 1;
                if (pageSize < 1) pageSize = 10;

                var paginatedStudents = studentsList
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                return Ok(new
                {
                    status = "success",
                    data = paginatedStudents,
                    total,
                    currentPage = page,
                    pageSize
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = "Error retrieving students data", message = ex.Message });
            }
        }

    }
}