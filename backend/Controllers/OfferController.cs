using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OfferController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OfferController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET ALL OFFERS
        [HttpGet]
        public async Task<IActionResult> GetOffers()
        {
            var offers = await _context.Offers.ToListAsync();

            return Ok(offers);
        }

        // GET OFFER BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOffer(int id)
        {
            var offer = await _context.Offers.FindAsync(id);

            if (offer == null)
            {
                return NotFound();
            }

            return Ok(offer);
        }

        // CREATE OFFER
        [HttpPost]
        public async Task<IActionResult> CreateOffer(Offer offer)
        {
            NormalizeOfferDates(offer);

            _context.Offers.Add(offer);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Offer created successfully"
            });
        }

        // UPDATE OFFER
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOffer(
            int id,
            Offer updatedOffer
        )
        {
            var offer = await _context.Offers.FindAsync(id);

            if (offer == null)
            {
                return NotFound();
            }

            offer.Title = updatedOffer.Title;
            offer.BusinessName = updatedOffer.BusinessName;
            offer.Description = updatedOffer.Description;
            offer.OriginalPrice = updatedOffer.OriginalPrice;
            offer.OfferPrice = updatedOffer.OfferPrice;
            offer.TotalSlots = updatedOffer.TotalSlots;
            offer.AvailableSlots = updatedOffer.AvailableSlots;
            offer.StartDate = ToUtc(updatedOffer.StartDate);
            offer.EndDate = ToUtc(updatedOffer.EndDate);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Offer updated successfully"
            });
        }

        // DELETE OFFER
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOffer(int id)
        {
            var offer = await _context.Offers.FindAsync(id);

            if (offer == null)
            {
                return NotFound();
            }

            _context.Offers.Remove(offer);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Offer deleted successfully"
            });
        }

        private static void NormalizeOfferDates(Offer offer)
        {
            offer.StartDate = ToUtc(offer.StartDate);
            offer.EndDate = ToUtc(offer.EndDate);
        }

        private static DateTime ToUtc(DateTime dateTime)
        {
            return dateTime.Kind == DateTimeKind.Utc
                ? dateTime
                : DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
        }
    }
}
