using System;
using System.Linq;
using System.Threading.Tasks;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Persistence.Data
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            // Create database if not exists
            await context.Database.EnsureCreatedAsync();

            // Seed Admin User
            if (!context.Users.Any(u => u.Mobile == "9198004022"))
            {
                await context.Users.AddAsync(new User
                {
                    Mobile = "9198004022",
                    Name = "Admin",
                    Role = "admin",
                    Email = "admin@shopease.com",
                    Address = "ShopEase Corporate Office, Silicon Valley",
                    Img = "https://i.pravatar.cc/150?img=5",
                    PasswordHash = null // Password-less OTP authentication
                });
            }

            // Seed Products
            if (context.Products.Count() < 30)
            {
                context.Products.RemoveRange(context.Products);
                await context.SaveChangesAsync();

                var products = new[]
                {
                    new Product
                    {
                        Name = "Modern Desk Lamp",
                        Brand = "Lumina",
                        Price = 34.99m,
                        Category = "Home Decor",
                        Material = "Metal",
                        Sizes = "Medium,Large",
                        Colors = "Black,White,Gold",
                        Description = "A sleek and energy-efficient desk lamp perfect for modern workspaces.",
                        Img = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
                        InStock = true,
                        Featured = true,
                        NewArrival = false
                    },
                    new Product
                    {
                        Name = "Travel Backpack",
                        Brand = "Nomad",
                        Price = 79.99m,
                        Category = "Accessories",
                        Material = "Nylon",
                        Sizes = "25L,35L",
                        Colors = "Charcoal,Olive,Navy",
                        Description = "Durable and spacious backpack ideal for travel and daily use.",
                        Img = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
                        InStock = true,
                        Featured = true,
                        NewArrival = true
                    },
                    new Product
                    {
                        Name = "Wireless Earbuds",
                        Brand = "Acoustic",
                        Price = 39.99m,
                        Category = "Electronics",
                        Material = "Plastic",
                        Sizes = "Standard",
                        Colors = "White,Black",
                        Description = "High-quality sound with noise isolation and long battery life.",
                        Img = "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
                        InStock = true,
                        Featured = false,
                        NewArrival = false
                    },
                    new Product
                    {
                        Name = "Minimal Watch",
                        Brand = "Chronos",
                        Price = 129.99m,
                        Category = "Accessories",
                        Material = "Leather & Stainless Steel",
                        Sizes = "40mm",
                        Colors = "Brown,Black,Silver",
                        Description = "Elegant minimal design with premium build and precise movement.",
                        Img = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
                        InStock = true,
                        Featured = true,
                        NewArrival = false
                    },
                    new Product
                    {
                        Name = "Bluetooth Speaker",
                        Brand = "Sonic",
                        Price = 49.99m,
                        Category = "Electronics",
                        Material = "Rubberized Plastic",
                        Sizes = "Compact",
                        Colors = "Red,Blue,Black",
                        Description = "Portable speaker with rich bass and crystal clear sound.",
                        Img = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
                        InStock = true,
                        Featured = false,
                        NewArrival = true
                    },
                    new Product
                    {
                        Name = "Gaming Mouse",
                        Brand = "Razer",
                        Price = 29.99m,
                        Category = "Electronics",
                        Material = "Plastic",
                        Sizes = "Ergonomic",
                        Colors = "RGB Black",
                        Description = "Ergonomic mouse with high precision and RGB lighting.",
                        Img = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
                        InStock = true,
                        Featured = false,
                        NewArrival = false
                    },
                    new Product
                    {
                        Name = "Laptop",
                        Brand = "Intel",
                        Price = 899.99m,
                        Category = "Electronics",
                        Material = "Aluminum",
                        Sizes = "15.6 Inch",
                        Colors = "Space Gray,Silver",
                        Description = "Powerful laptop designed for performance, multitasking, and gaming.",
                        Img = "https://images.unsplash.com/photo-1496181130204-755241524eab?w=500",
                        InStock = true,
                        Featured = true,
                        NewArrival = true
                    },
                    new Product
                    {
                        Name = "Smart Water Bottle",
                        Brand = "Hydra",
                        Price = 19.99m,
                        Category = "Accessories",
                        Material = "Stainless Steel",
                        Sizes = "600ml",
                        Colors = "Teal,Matte Black,Pink",
                        Description = "Tracks hydration and reminds you to drink water regularly.",
                        Img = "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
                        InStock = true,
                        Featured = false,
                        NewArrival = false
                    },
                    new Product
                    {
                        Name = "Office Chair",
                        Brand = "Ergo",
                        Price = 149.99m,
                        Category = "Furniture",
                        Material = "Mesh & Steel",
                        Sizes = "Adjustable",
                        Colors = "Black,Gray",
                        Description = "Comfortable ergonomic chair designed for long work hours.",
                        Img = "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500",
                        InStock = true,
                        Featured = true,
                        NewArrival = false
                    },
                    new Product
                    {
                        Name = "Mechanical Keyboard",
                        Brand = "Keychron",
                        Price = 89.99m,
                        Category = "Electronics",
                        Material = "Aluminum & ABS",
                        Sizes = "Tenkeyless",
                        Colors = "Grey-Black",
                        Description = "Responsive mechanical keyboard with tactile feedback.",
                        Img = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
                        InStock = true,
                        Featured = false,
                        NewArrival = false
                    },
                    new Product
                    {
                        Name = "Running Shoes",
                        Brand = "Nike",
                        Price = 69.99m,
                        Category = "Apparel",
                        Material = "Mesh & Rubber",
                        Sizes = "8,9,10,11",
                        Colors = "Volt-Green,Black-White",
                        Description = "Lightweight and comfortable shoes perfect for daily running.",
                        Img = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
                        InStock = true,
                        Featured = true,
                        NewArrival = true
                    }
                };
                
                var productList = products.ToList();
                var categories = new[] { "Home Decor", "Accessories", "Electronics", "Furniture", "Apparel" };
                var brands = new[] { "Lumina", "Nomad", "Acoustic", "Chronos", "Sonic", "Razer", "Intel", "Hydra", "Ergo", "Keychron", "Nike" };
                var materials = new[] { "Metal", "Nylon", "Plastic", "Leather", "Steel", "Wood", "Cotton" };
                var colorsList = new[] { "Black", "White", "Silver", "Gray", "Blue", "Green", "Red" };
                var random = new Random(42);

                for (int i = 1; i <= 50; i++)
                {
                    var category = categories[random.Next(categories.Length)];
                    var brand = brands[random.Next(brands.Length)];
                    var material = materials[random.Next(materials.Length)];
                    var colors = string.Join(",", colorsList.OrderBy(x => random.Next()).Take(random.Next(1, 4)));
                    
                    productList.Add(new Product
                    {
                        Name = $"{brand} {category} Item #{i}",
                        Brand = brand,
                        Price = Math.Round((decimal)(random.NextDouble() * 500 + 10), 2),
                        Category = category,
                        Material = material,
                        Sizes = "S,M,L,XL",
                        Colors = colors,
                        Description = $"High quality product from {brand} designed for {category}.",
                        Img = i % 2 == 0 
                            ? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" 
                            : "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500",
                        InStock = random.Next(10) > 1,
                        Featured = random.Next(10) > 7,
                        NewArrival = random.Next(10) > 7
                    });
                }
                
                await context.Products.AddRangeAsync(productList);
            }

            await context.SaveChangesAsync();
        }
    }
}
