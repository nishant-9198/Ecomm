namespace Ecommerce.Application.DTOs
{
    public class ProductCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Brand { get; set; }
        public decimal Price { get; set; }
        public string? Category { get; set; }
        public string? Material { get; set; }
        public string? Sizes { get; set; }
        public string? Colors { get; set; }
        public string? Description { get; set; }
        public string Img { get; set; } = string.Empty; // base64 or url
        public bool InStock { get; set; } = true;
        public bool NewArrival { get; set; } = false;
        public bool Featured { get; set; } = false;
    }
}
