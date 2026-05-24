namespace backend.Models
{
    public class Offer
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string BusinessName { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal OriginalPrice { get; set; }

        public decimal OfferPrice { get; set; }

        public int TotalSlots { get; set; }

        public int AvailableSlots { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }
    }
}