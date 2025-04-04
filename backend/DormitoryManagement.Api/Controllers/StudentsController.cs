using Microsoft.AspNetCore.Mvc;
using DormitoryManagement.Data.Context;
using DormitoryManagement.Data.Models;
using Microsoft.AspNetCore.Authorization;

namespace DormitoryManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public StudentsController(DormitoryManagementContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Commandant,Student,Castelian")]
        [HttpGet]
        public IActionResult GetStudents()
        {
            var students = _context.Students
                .Select(s => new
                {
                    s.StudentNumber,
                    s.FirstName,
                    s.LastName,
                    s.Phone,
                    s.Gender,
                    s.BirthDate
                })
                .ToList();

            return Ok(students);
        }

        [Authorize(Roles = "Commandant")]
        [HttpPost]
        public IActionResult CreateStudent([FromBody] Student student)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Students.Add(student);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetStudents), new { studentNumber = student.StudentNumber }, student);
        }

        [Authorize(Roles = "Commandant")]
        [HttpDelete("{StudentNumber}")]
        public IActionResult DeleteStudent(int StudentNumber)
        {
            var student = _context.Students.Find(StudentNumber);
            if (student == null)
                return NotFound();

            _context.Students.Remove(student);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
