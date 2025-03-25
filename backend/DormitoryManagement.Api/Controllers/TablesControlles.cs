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

    [ApiController]
    [Route("api/[controller]")]
    public class MattressesController : ControllerBase
    {
        private readonly DormitoryManagementContext _context;

        public MattressesController(DormitoryManagementContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetMattresses()
        {
            var mattresses = _context.Mattresses.ToList();
            return Ok(mattresses);
        }

        [HttpPost]
        public IActionResult CreateMattress([FromBody] Mattress mattress)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Mattresses.Add(mattress);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetMattresses), new { serialNumber = mattress.SerialNumber }, mattress);
        }

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
