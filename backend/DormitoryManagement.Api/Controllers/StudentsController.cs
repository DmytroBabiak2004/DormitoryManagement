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

        [Authorize(Roles = "Commandant,Castelian")]
        [HttpGet]
        public IActionResult GetStudents(int page = 1, int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            var total = _context.Students.Count();

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

        [Authorize(Roles = "Commandant,Castelian")]
        [HttpGet("search")]
        public IActionResult SearchStudents(string query, int page = 1, int pageSize = 10)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return GetStudents(page, pageSize); // If query is empty, return all students
            }

            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            // Normalize query to lowercase for case-insensitive search
            var normalizedQuery = query.ToLower();

            // Search across multiple fields
            var studentsQuery = _context.Students
                .Where(s =>
                    s.StudentNumber.ToLower().Contains(normalizedQuery) ||
                    s.FirstName.ToLower().Contains(normalizedQuery) ||
                    s.LastName.ToLower().Contains(normalizedQuery) ||
                    s.Phone.ToLower().Contains(normalizedQuery)
                );

            var total = studentsQuery.Count();

            var students = studentsQuery
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

            student.FirstName = dto.FirstName;
            student.LastName = dto.LastName;
            // Update other fields as needed
            student.Phone = dto.Phone;
            student.Gender = dto.Gender;
            student.BirthDate = dto.BirthDate;

            _context.SaveChanges();

            var studentDto = new StudentDto
            {
                StudentNumber = student.StudentNumber,
                FirstName = student.FirstName,
                LastName = student.LastName,
                Phone = student.Phone,
                Gender = student.Gender ?? false,
                BirthDate = student.BirthDate ?? DateOnly.MinValue
            };

            return Ok(studentDto);
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