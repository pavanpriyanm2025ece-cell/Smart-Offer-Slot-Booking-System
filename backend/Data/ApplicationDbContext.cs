using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options
        ) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Offer> Offers { get; set; }

        public DbSet<Booking> Bookings { get; set; }
    }
}