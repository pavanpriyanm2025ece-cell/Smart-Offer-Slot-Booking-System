using Microsoft.AspNetCore.Mvc;
using backend.Data;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(
            ApplicationDbContext context
        )
        {
            _context = context;
        }

        [HttpGet("stats")]
        public IActionResult GetStats()
        {
            var totalOffers = _context.Offers.Count();

            var totalBookings = _context.Bookings.Count();

            var activeOffers = _context.Offers
                .Count(o => o.AvailableSlots > 0);

            return Ok(new
            {
                totalOffers,
                totalBookings,
                activeOffers
            });
        }
    }
}