using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET ALL BOOKINGS
        [HttpGet]
        public async Task<IActionResult> GetBookings()
        {
            var bookings = await _context.Bookings
                .Include(b => b.Offer)
                .ToListAsync();

            return Ok(bookings);
        }

        // CREATE BOOKING
        [HttpPost]
        public async Task<IActionResult> CreateBooking(
            CreateBookingDTO bookingDto
        )
        {
            if (bookingDto.OfferId <= 0)
            {
                return BadRequest(new
                {
                    message = "A valid offerId is required"
                });
            }

            if (bookingDto.PeopleCount <= 0)
            {
                return BadRequest(new
                {
                    message = "People count must be greater than zero"
                });
            }

            var offer = await _context.Offers.FindAsync(
                bookingDto.OfferId
            );

            if (offer == null)
            {
                return NotFound(new
                {
                    message = $"Offer with id {bookingDto.OfferId} was not found. Create an offer first or use an existing offerId."
                });
            }

            if (offer.AvailableSlots < bookingDto.PeopleCount)
            {
                return BadRequest(new
                {
                    message = $"Only {offer.AvailableSlots} slots are available for this offer"
                });
            }

            offer.AvailableSlots -= bookingDto.PeopleCount;

            var booking = new Booking
            {
                CustomerName = bookingDto.CustomerName,
                Email = bookingDto.Email,
                Phone = bookingDto.Phone,
                PeopleCount = bookingDto.PeopleCount,
                SlotTime = bookingDto.SlotTime,
                OfferId = bookingDto.OfferId
            };

            _context.Bookings.Add(booking);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Booking created successfully",
                bookingId = booking.Id
            });
        }
    }
}
