using System;

namespace Ecommerce.Domain.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Brand { get; set; }
        public decimal Price { get; set; }
        public string? Category { get; set; }
        public string? Material { get; set; }
        public string? Sizes { get; set; } // comma separated values e.g. "S,M,L"
        public string? Colors { get; set; } // comma separated values e.g. "Black,White"
        public string? Description { get; set; }
        public string Img { get; set; } = string.Empty; // Holds URL or Base64 or local path
        public bool InStock { get; set; } = true;
        public bool NewArrival { get; set; } = false;
        public bool Featured { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
