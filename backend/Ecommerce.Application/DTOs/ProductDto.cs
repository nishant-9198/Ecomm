namespace Ecommerce.Application.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Brand { get; set; }
        public decimal Price { get; set; }
        public string? Category { get; set; }
        public string? Material { get; set; }
        public string? Sizes { get; set; }
        public string? Colors { get; set; }
        public string? Description { get; set; }
        public string Img { get; set; } = string.Empty;
        public bool InStock { get; set; }
        public bool NewArrival { get; set; }
        public bool Featured { get; set; }
    }
}
