using Microsoft.AspNetCore.Mvc;
using DormitoryManagement.Data.Context;
using DormitoryManagement.Data.Models;
using Microsoft.AspNetCore.Authorization;

namespace DormitoryManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChairsController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public ChairsController(DormitoryManagementContext context)
        {
            _context = context;
        }

        [Authorize(Roles ="Student")]
        [HttpGet]
        public IActionResult GetChairs()
        {
            var chairs = _context.Chairs.ToList();
            return Ok(chairs);
        }

        [HttpPost]
        public IActionResult CreateChair([FromBody] Chair chair)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Chairs.Add(chair);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetChairs), new { serialNumber = chair.SerialNumber }, chair);
        }

        [HttpDelete("{serialNumber}")]
        public IActionResult DeleteChair(int serialNumber)
        {
            var chair = _context.Chairs.Find(serialNumber);
            if (chair == null)
                return NotFound();

            _context.Chairs.Remove(chair);
            _context.SaveChanges();

            return NoContent();
        }
    }
}