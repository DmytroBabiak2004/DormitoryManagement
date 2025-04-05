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
    public class StudentsController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public StudentsController(DormitoryManagementContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Commandant,Student,Castelian")]
        [HttpGet]
        public IActionResult GetStudents(int page = 1, int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            var total = _context.Students.Count();

            // Отримуємо студентів з пагінацією і вручну створюємо DTO
            var students = _context.Students
                .OrderBy(s => s.StudentNumber)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(s => new StudentDto
                {
                    StudentNumber = s.StudentNumber,
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    Phone = s.Phone,
                    Gender = s.Gender ?? false,
                    BirthDate = s.BirthDate ?? DateOnly.MinValue 
                })
                .ToList();

            return Ok(new
            {
                students,
                total
            });
        }

        [Authorize(Roles = "Commandant")]
        [HttpPost]
        public IActionResult CreateStudent([FromBody] CreateStudentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Вручну створюємо сутність Student з DTO
            var student = new Student
            {
                StudentNumber = dto.StudentNumber,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Phone = dto.Phone,
                Gender = dto.Gender,
                BirthDate = dto.BirthDate
            };

            _context.Students.Add(student);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetStudents), new { studentNumber = student.StudentNumber }, student);
        }

        [Authorize(Roles = "Commandant")]
        [HttpPut("{studentNumber}")]
        public IActionResult UpdateStudent(string studentNumber, [FromBody] UpdateStudentDto dto)
        {
            var student = _context.Students.FirstOrDefault(s => s.StudentNumber == studentNumber);
            if (student == null) return NotFound();

            // Вручну оновлюємо поля сутності з DTO
            student.FirstName = dto.FirstName;
            student.LastName = dto.LastName;
            // Оновлюй інші поля, які є в UpdateStudentDto

            _context.SaveChanges();
            return Ok(student);
        }

        [Authorize(Roles = "Commandant")]
        [HttpDelete("{studentNumber}")]
        public IActionResult DeleteStudent(string studentNumber)
        {
            var student = _context.Students.FirstOrDefault(s => s.StudentNumber == studentNumber);
            if (student == null)
                return NotFound();

            _context.Students.Remove(student);
            _context.SaveChanges();

            return NoContent();
        }
    }
}