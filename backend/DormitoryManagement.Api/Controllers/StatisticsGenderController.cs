using DormitoryManagement.Data.Context;
using DormitoryManagement.Data.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DormitoryManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatisticsGenderController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public StatisticsGenderController(DormitoryManagementContext context)
        {
            _context = context;
        }

        // Метод отримання статистики
        private async Task<List<GenderCountDto>> GetGenderStatisticsLinqAsync()
        {
            return await _context.Students
                .GroupBy(s => s.Gender)
                .Select(g => new GenderCountDto
                {
                    Gender = g.Key,
                    StudentCount = g.Count()
                }).ToListAsync();
        }

        [HttpGet("gender-count")]
        public async Task<ActionResult<List<GenderCountDto>>> GetGenderCount()
        {
            var result = await GetGenderStatisticsLinqAsync();
            return Ok(result);
        }
    }
}
