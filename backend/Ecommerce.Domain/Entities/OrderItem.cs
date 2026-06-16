namespace Ecommerce.Domain.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }
        public string OrderId { get; set; } = string.Empty;
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Img { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }
}
