namespace backend.DTOs
{
    public class CreateBookingDTO
    {
        public string CustomerName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public int PeopleCount { get; set; }

        public string SlotTime { get; set; } = string.Empty;

        public int OfferId { get; set; }
    }
}
