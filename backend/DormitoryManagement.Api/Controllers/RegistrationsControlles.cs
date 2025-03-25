using DormitoryManagement.Data.Context;
using DormitoryManagement.Data.Models;
using Microsoft.AspNetCore.Mvc;

namespace DormitoryManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationsController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public RegistrationsController(DormitoryManagementContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetRegistrations()
        {
            var registrations = _context.Registrations.ToList();
            return Ok(registrations);
        }

        [HttpPost]
        public IActionResult CreateRegistration([FromBody] Registration registration)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Registrations.Add(registration);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetRegistrations), new { id = registration.RegistrationId }, registration);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteRegistration(int id)
        {
            var registration = _context.Registrations.Find(id);
            if (registration == null)
                return NotFound();

            _context.Registrations.Remove(registration);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
