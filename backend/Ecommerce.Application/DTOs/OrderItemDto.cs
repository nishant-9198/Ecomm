namespace Ecommerce.Application.DTOs
{
    public class OrderItemDto
    {
        public int Id { get; set; } // Matches the frontend's product id field
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Img { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }
}
