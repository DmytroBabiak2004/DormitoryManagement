using DormitoryManagement.Data.Context;
using DormitoryManagement.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DormitoryManagement.Api.Controllers
{
    [Authorize(Roles = "Commandant,Castelian")]
    [ApiController]
    [Route("api/[controller]")]
    public class MattressesController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public MattressesController(DormitoryManagementContext context)
        {
            _context = context;
        }
        [Authorize(Roles = "Commandant,Castelian,Student")]
        [HttpGet]
        public IActionResult GetMattresses()
        {
            var mattresses = _context.Mattresses.ToList();
            return Ok(mattresses);
        }
        [Authorize(Roles = "Commandant,Castelian")]
        [HttpPost]
        public IActionResult CreateMattress([FromBody] Mattress mattress)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Mattresses.Add(mattress);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetMattresses), new { serialNumber = mattress.SerialNumber }, mattress);
        }
        [Authorize(Roles = "Commandant,Castelian")]
        [HttpDelete("{serialNumber}")]
        public IActionResult DeleteMattress(int serialNumber)
        {
            var mattress = _context.Mattresses.Find(serialNumber);
            if (mattress == null)
                return NotFound();

            _context.Mattresses.Remove(mattress);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
