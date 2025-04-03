using DormitoryManagement.Data.Context;
using DormitoryManagement.Data.Models;
using Microsoft.AspNetCore.Mvc;

namespace DormitoryManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TablesController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public TablesController(DormitoryManagementContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetTables()
        {
            var tables = _context.Tables.ToList();
            return Ok(tables);
        }

        [HttpPost]
        public IActionResult CreateTable([FromBody] Table table)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Tables.Add(table);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetTables), new { serialNumber = table.SerialNumber }, table);
        }

        [HttpDelete("{serialNumber}")]
        public IActionResult DeleteTable(int serialNumber)
        {
            var table = _context.Tables.Find(serialNumber);
            if (table == null)
                return NotFound();

            _context.Tables.Remove(table);
            _context.SaveChanges();

            return NoContent();
        }
    }
}