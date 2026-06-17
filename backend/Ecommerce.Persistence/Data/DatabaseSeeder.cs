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
            if (context.Products.Count() < 61 || !context.Products.Any(p => p.Name.Contains("Noise-Cancelling Headphones")))
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
                
                var additionalProducts = new[]
                {
                    // Electronics (10 items)
                    new Product {
                        Name = "Noise-Cancelling Headphones", Brand = "Sony", Price = 299.99m, Category = "Electronics",
                        Material = "Plastic & Leather", Sizes = "One Size", Colors = "Black,Silver", InStock = true, Featured = true, NewArrival = false,
                        Description = "Industry-leading noise canceling wireless headphones with premium sound quality and voice control.",
                        Img = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
                    },
                    new Product {
                        Name = "Wireless Charging Pad", Brand = "Belkin", Price = 39.99m, Category = "Electronics",
                        Material = "Rubberized Plastic", Sizes = "Standard", Colors = "Black,White", InStock = true, Featured = false, NewArrival = true,
                        Description = "Fast wireless charging pad for Apple and Android devices with non-slip surface.",
                        Img = "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=500"
                    },
                    new Product {
                        Name = "Compact Smart Speaker", Brand = "Amazon", Price = 49.99m, Category = "Electronics",
                        Material = "Fabric & Plastic", Sizes = "Mini", Colors = "Charcoal,Sandstone", InStock = true, Featured = true, NewArrival = false,
                        Description = "Smart speaker with Alexa assistant, crisp vocals, and balanced bass performance.",
                        Img = "https://images.unsplash.com/photo-1543512214-318c7553f230?w=500"
                    },
                    new Product {
                        Name = "Portable Power Bank 20K", Brand = "Anker", Price = 59.99m, Category = "Electronics",
                        Material = "Aluminum", Sizes = "20000mAh", Colors = "Black,Blue", InStock = true, Featured = false, NewArrival = false,
                        Description = "High capacity portable charger with PowerIQ technology and dual USB-C outputs.",
                        Img = "https://images.unsplash.com/photo-1609592424109-dd2556e3927f?w=500"
                    },
                    new Product {
                        Name = "8-in-1 USB-C Hub", Brand = "Satechi", Price = 79.99m, Category = "Electronics",
                        Material = "Aluminum", Sizes = "Slim", Colors = "Space Gray,Silver", InStock = true, Featured = false, NewArrival = true,
                        Description = "Multi-port adapter with 4K HDMI, pass-through charging, SD card reader, and USB-A ports.",
                        Img = "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500"
                    },
                    new Product {
                        Name = "Ergonomic Laptop Stand", Brand = "Rain Design", Price = 49.99m, Category = "Electronics",
                        Material = "Aluminum", Sizes = "Standard", Colors = "Silver,Space Gray", InStock = true, Featured = false, NewArrival = false,
                        Description = "Premium aluminum laptop stand designed to improve posture and laptop cooling.",
                        Img = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500"
                    },
                    new Product {
                        Name = "Mechanical Keyboard K2", Brand = "Keychron", Price = 99.99m, Category = "Electronics",
                        Material = "Aluminum", Sizes = "75% Layout", Colors = "Gray,Black", InStock = true, Featured = true, NewArrival = true,
                        Description = "Wireless mechanical keyboard with Gateron switches and RGB backlighting.",
                        Img = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500"
                    },
                    new Product {
                        Name = "Wireless Gaming Mouse", Brand = "Logitech", Price = 149.99m, Category = "Electronics",
                        Material = "Plastic", Sizes = "Ergonomic", Colors = "Black,White", InStock = true, Featured = true, NewArrival = false,
                        Description = "Ultra-lightweight wireless gaming mouse with HERO sensor and sub-micron tracking.",
                        Img = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500"
                    },
                    new Product {
                        Name = "Premium Active Earbuds", Brand = "Jabra", Price = 179.99m, Category = "Electronics",
                        Material = "Plastic & Silicone", Sizes = "Standard", Colors = "Navy,Black,Gold", InStock = true, Featured = false, NewArrival = false,
                        Description = "Waterproof true wireless workout earbuds with active noise cancellation.",
                        Img = "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500"
                    },
                    new Product {
                        Name = "Rugged Bluetooth Speaker", Brand = "JBL", Price = 129.99m, Category = "Electronics",
                        Material = "Fabric & Rubber", Sizes = "Medium", Colors = "Blue,Red,Teal", InStock = true, Featured = false, NewArrival = true,
                        Description = "IP67 waterproof and dustproof portable speaker with deep bass and 12h playtime.",
                        Img = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500"
                    },

                    // Home Decor (10 items)
                    new Product {
                        Name = "Ceramic Bud Vase Set", Brand = "Atelier", Price = 29.99m, Category = "Home Decor",
                        Material = "Ceramic", Sizes = "Small", Colors = "White,Terracotta", InStock = true, Featured = false, NewArrival = true,
                        Description = "Set of three minimal ceramic bud vases perfect for displaying single stems.",
                        Img = "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500"
                    },
                    new Product {
                        Name = "Scented Soy Wax Candle", Brand = "Atelier", Price = 24.99m, Category = "Home Decor",
                        Material = "Glass & Soy", Sizes = "8 oz", Colors = "Amber,Clear", InStock = true, Featured = false, NewArrival = false,
                        Description = "Hand-poured lavender and eucalyptus scented soy candle with a wooden wick.",
                        Img = "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500"
                    },
                    new Product {
                        Name = "Minimalist Wall Clock", Brand = "Muji", Price = 45.00m, Category = "Home Decor",
                        Material = "Wood & Glass", Sizes = "12 Inch", Colors = "Maple,White", InStock = true, Featured = true, NewArrival = false,
                        Description = "Silent sweep wooden wall clock with a clean face and minimalist markings.",
                        Img = "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500"
                    },
                    new Product {
                        Name = "Geometric Throw Pillow", Brand = "West Elm", Price = 35.00m, Category = "Home Decor",
                        Material = "Cotton & Linen", Sizes = "18x18", Colors = "Mustard,Navy,Rust", InStock = true, Featured = false, NewArrival = false,
                        Description = "Textured cotton pillow cover with an embroidered modern geometric pattern.",
                        Img = "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500"
                    },
                    new Product {
                        Name = "Woven Wool Blanket", Brand = "Pendleton", Price = 119.99m, Category = "Home Decor",
                        Material = "Wool & Cotton", Sizes = "Throw", Colors = "Olive,Grey,Beige", InStock = true, Featured = true, NewArrival = false,
                        Description = "Warm and soft merino wool blend woven throw blanket with fringe details.",
                        Img = "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=500"
                    },
                    new Product {
                        Name = "Brass Vanity Mirror", Brand = "H&M Home", Price = 39.99m, Category = "Home Decor",
                        Material = "Brass & Glass", Sizes = "Medium", Colors = "Gold", InStock = true, Featured = false, NewArrival = true,
                        Description = "Elegant tabletop brass frame mirror with a storage tray at the base.",
                        Img = "https://images.unsplash.com/photo-1597484211625-27a3c30a597a?w=500"
                    },
                    new Product {
                        Name = "Hanging Ceramic Planter", Brand = "Plant shop", Price = 25.00m, Category = "Home Decor",
                        Material = "Ceramic & Leather", Sizes = "Small", Colors = "Grey-White", InStock = true, Featured = false, NewArrival = false,
                        Description = "Indoor hanging pot with adjustable leather cords for succulents and air plants.",
                        Img = "https://images.unsplash.com/photo-1545241047-6083a3684587?w=500"
                    },
                    new Product {
                        Name = "Abstract Ink Art Print", Brand = "Atelier", Price = 49.99m, Category = "Home Decor",
                        Material = "Paper & Wood", Sizes = "16x20", Colors = "Black,White", InStock = true, Featured = true, NewArrival = true,
                        Description = "Framed abstract ink art print on fine archival textured paper.",
                        Img = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500"
                    },
                    new Product {
                        Name = "Architect Lamp", Brand = "Lumina", Price = 59.99m, Category = "Home Decor",
                        Material = "Steel", Sizes = "Large", Colors = "Black,Silver", InStock = true, Featured = false, NewArrival = false,
                        Description = "Classic adjustable architect desk lamp with high-tension springs and solid clamp.",
                        Img = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500"
                    },
                    new Product {
                        Name = "Velvet Round Ottoman", Brand = "CB2", Price = 129.99m, Category = "Home Decor",
                        Material = "Velvet & Steel", Sizes = "Standard", Colors = "Emerald,Royal Blue", InStock = true, Featured = false, NewArrival = false,
                        Description = "Luxurious velvet round ottoman stool with a brushed brass base ring.",
                        Img = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"
                    },

                    // Accessories (10 items)
                    new Product {
                        Name = "Leather Cardholder Wallet", Brand = "Nomad", Price = 49.99m, Category = "Accessories",
                        Material = "Horween Leather", Sizes = "Slim", Colors = "Brown,Black", InStock = true, Featured = true, NewArrival = false,
                        Description = "Minimalist leather wallet designed to hold up to 6 cards and folded cash.",
                        Img = "https://images.unsplash.com/photo-1627124118304-42a8b349f24e?w=500"
                    },
                    new Product {
                        Name = "Classic Aviator Sunglasses", Brand = "Ray-Ban", Price = 169.99m, Category = "Accessories",
                        Material = "Metal", Sizes = "Standard", Colors = "Gold,Black", InStock = true, Featured = true, NewArrival = false,
                        Description = "Classic metal aviator sunglasses with green polarized protective lenses.",
                        Img = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500"
                    },
                    new Product {
                        Name = "Ribbed Merino Beanie", Brand = "Patagonia", Price = 35.00m, Category = "Accessories",
                        Material = "Merino Wool", Sizes = "One Size", Colors = "Navy,Olive,Grey", InStock = true, Featured = false, NewArrival = true,
                        Description = "Soft and warm merino wool ribbed knit beanie with a roll-up cuff.",
                        Img = "https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?w=500"
                    },
                    new Product {
                        Name = "Heavy Canvas Tote Bag", Brand = "Nomad", Price = 29.99m, Category = "Accessories",
                        Material = "Cotton Canvas", Sizes = "15L", Colors = "Natural,Navy", InStock = true, Featured = false, NewArrival = false,
                        Description = "Durable canvas tote bag with reinforced handles and interior zip pocket.",
                        Img = "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500"
                    },
                    new Product {
                        Name = "Mulberry Silk Scarf", Brand = "Atelier", Price = 65.00m, Category = "Accessories",
                        Material = "Silk", Sizes = "Square", Colors = "Pattern,Blue", InStock = true, Featured = false, NewArrival = true,
                        Description = "100% pure mulberry silk neck scarf with hand-rolled edges.",
                        Img = "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500"
                    },
                    new Product {
                        Name = "Chronograph Watch", Brand = "Chronos", Price = 189.99m, Category = "Accessories",
                        Material = "Stainless Steel", Sizes = "42mm", Colors = "Silver-Blue,Black", InStock = true, Featured = true, NewArrival = false,
                        Description = "Stainless steel quartz chronograph watch with double dome sapphire crystal.",
                        Img = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
                    },
                    new Product {
                        Name = "City Commuter Backpack", Brand = "Nomad", Price = 99.99m, Category = "Accessories",
                        Material = "Nylon Cordura", Sizes = "20L", Colors = "Black,Charcoal", InStock = true, Featured = false, NewArrival = false,
                        Description = "Weather-resistant commuter backpack with a dedicated 16-inch laptop pocket.",
                        Img = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
                    },
                    new Product {
                        Name = "Vacuum Insulated Bottle", Brand = "Hydra", Price = 29.99m, Category = "Accessories",
                        Material = "Stainless Steel", Sizes = "750ml", Colors = "White,Black,Slate", InStock = true, Featured = false, NewArrival = false,
                        Description = "Double-wall insulated flask keeping drinks cold for 24h or hot for 12h.",
                        Img = "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"
                    },
                    new Product {
                        Name = "Classic Leather Belt", Brand = "Fossil", Price = 45.00m, Category = "Accessories",
                        Material = "Full Grain Leather", Sizes = "32,34,36", Colors = "Brown,Black", InStock = true, Featured = false, NewArrival = false,
                        Description = "Genuine full grain leather belt with a brushed nickel buckle.",
                        Img = "https://images.unsplash.com/photo-1624222247344-550fb8ecf7db?w=500"
                    },
                    new Product {
                        Name = "Tech Organizer Travel Pouch", Brand = "Nomad", Price = 34.99m, Category = "Accessories",
                        Material = "Polyester", Sizes = "Compact", Colors = "Black,Grey", InStock = true, Featured = false, NewArrival = true,
                        Description = "Travel pouch with multiple mesh pockets and elastic loops for cords and chargers.",
                        Img = "https://images.unsplash.com/photo-1590247813693-5541f1c009d0?w=500"
                    },

                    // Furniture (10 items)
                    new Product {
                        Name = "Oak Floating Side Table", Brand = "Ergo", Price = 89.99m, Category = "Furniture",
                        Material = "Oak Wood", Sizes = "Standard", Colors = "Light Oak", InStock = true, Featured = false, NewArrival = true,
                        Description = "Minimalist wall-mounted oak bedside drawer table with cable slot.",
                        Img = "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=500"
                    },
                    new Product {
                        Name = "Mesh Task Office Chair", Brand = "Ergo", Price = 199.99m, Category = "Furniture",
                        Material = "Mesh & Nylon", Sizes = "Adjustable", Colors = "Black,Grey", InStock = true, Featured = true, NewArrival = false,
                        Description = "Ergonomic mesh office chair with lumber support and 3D armrests.",
                        Img = "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500"
                    },
                    new Product {
                        Name = "Bamboo 3-Tier Shoe Rack", Brand = "Muji", Price = 49.99m, Category = "Furniture",
                        Material = "Bamboo", Sizes = "3-Tier", Colors = "Natural Wood", InStock = true, Featured = false, NewArrival = false,
                        Description = "Natural bamboo open shoe organizer shelf holding up to 9 pairs.",
                        Img = "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500"
                    },
                    new Product {
                        Name = "Modern Velvet Accent Chair", Brand = "West Elm", Price = 249.99m, Category = "Furniture",
                        Material = "Velvet & Steel", Sizes = "Medium", Colors = "Yellow,Emerald", InStock = true, Featured = true, NewArrival = false,
                        Description = "Mid-century modern velvet accent chair with slim black steel legs.",
                        Img = "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500"
                    },
                    new Product {
                        Name = "Floating Oak Shelves Set", Brand = "Atelier", Price = 59.99m, Category = "Furniture",
                        Material = "Oak Wood", Sizes = "Set of 3", Colors = "Oak,Walnut", InStock = true, Featured = false, NewArrival = true,
                        Description = "Set of three solid oak wood floating shelves with hidden brackets.",
                        Img = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500"
                    },
                    new Product {
                        Name = "Minimalist Arch Floor Mirror", Brand = "West Elm", Price = 179.99m, Category = "Furniture",
                        Material = "Metal & Glass", Sizes = "65x22 Inch", Colors = "Black,Gold", InStock = true, Featured = false, NewArrival = false,
                        Description = "Full-length arched metal framed floor standing mirror.",
                        Img = "https://images.unsplash.com/photo-1617806118233-18e1db207f62?w=500"
                    },
                    new Product {
                        Name = "Walnut Wood Coffee Table", Brand = "CB2", Price = 299.99m, Category = "Furniture",
                        Material = "Walnut Wood", Sizes = "Oval", Colors = "Dark Walnut", InStock = true, Featured = true, NewArrival = false,
                        Description = "Solid walnut oval coffee table featuring a bottom shelf for books.",
                        Img = "https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=500"
                    },
                    new Product {
                        Name = "Minimalist Bookshelf", Brand = "Muji", Price = 149.99m, Category = "Furniture",
                        Material = "Wood", Sizes = "5-Shelf", Colors = "Oak,White", InStock = true, Featured = false, NewArrival = false,
                        Description = "Simple open wood bookshelf unit with five tiers of storage.",
                        Img = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=500"
                    },
                    new Product {
                        Name = "Adjustable Standing Desk", Brand = "Ergo", Price = 349.99m, Category = "Furniture",
                        Material = "Steel & Wood", Sizes = "55x30 Inch", Colors = "Maple-White,Black", InStock = true, Featured = false, NewArrival = true,
                        Description = "Dual-motor electric height adjustable standing desk with memory presets.",
                        Img = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500"
                    },
                    new Product {
                        Name = "Mid-Century Nightstand", Brand = "West Elm", Price = 159.00m, Category = "Furniture",
                        Material = "Acacia Wood", Sizes = "Standard", Colors = "Acacia", InStock = true, Featured = false, NewArrival = false,
                        Description = "Bedside nightstand table with two drawers and tapered legs.",
                        Img = "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=500"
                    },

                    // Apparel (10 items)
                    new Product {
                        Name = "Classic Denim Jacket", Brand = "Levi's", Price = 89.99m, Category = "Apparel",
                        Material = "100% Cotton Denim", Sizes = "S,M,L,XL", Colors = "Indigo,Light Wash", InStock = true, Featured = false, NewArrival = false,
                        Description = "Timeless denim trucker jacket with button closures and chest flap pockets.",
                        Img = "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500"
                    },
                    new Product {
                        Name = "Merino Running Shoes", Brand = "Nike", Price = 119.99m, Category = "Apparel",
                        Material = "Wool Blend Mesh", Sizes = "8,9,10,11", Colors = "Volt,Grey", InStock = true, Featured = true, NewArrival = false,
                        Description = "Comfortable, lightweight running shoes woven from merino wool blend.",
                        Img = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
                    },
                    new Product {
                        Name = "Cotton Crewneck Sweatshirt", Brand = "Champion", Price = 49.99m, Category = "Apparel",
                        Material = "Cotton Fleece", Sizes = "S,M,L,XL", Colors = "Grey,Black,Navy", InStock = true, Featured = false, NewArrival = true,
                        Description = "Heavyweight cotton fleece crewneck sweatshirt with ribbed details.",
                        Img = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500"
                    },
                    new Product {
                        Name = "Slim Fit Chino Pants", Brand = "Everlane", Price = 68.00m, Category = "Apparel",
                        Material = "Cotton Twill", Sizes = "30,32,34", Colors = "Khaki,Navy,Olive", InStock = true, Featured = false, NewArrival = false,
                        Description = "Comfortable stretch cotton twill chinos in a modern slim cut.",
                        Img = "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500"
                    },
                    new Product {
                        Name = "Classic Linen Shirt", Brand = "Everlane", Price = 58.00m, Category = "Apparel",
                        Material = "100% Linen", Sizes = "S,M,L,XL", Colors = "White,Light Blue", InStock = true, Featured = false, NewArrival = true,
                        Description = "Breathable pure linen long-sleeve button-down summer shirt.",
                        Img = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500"
                    },
                    new Product {
                        Name = "Leather Chelsea Boots", Brand = "Clarks", Price = 149.99m, Category = "Apparel",
                        Material = "Leather & Rubber", Sizes = "9,10,11", Colors = "Black,Tan", InStock = true, Featured = true, NewArrival = false,
                        Description = "Premium leather Chelsea boots with elastic side panels and durable rubber sole.",
                        Img = "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500"
                    },
                    new Product {
                        Name = "Wool Blend Overcoat", Brand = "Atelier", Price = 199.99m, Category = "Apparel",
                        Material = "Wool Blend", Sizes = "M,L,XL", Colors = "Camel,Charcoal", InStock = true, Featured = true, NewArrival = false,
                        Description = "Classic tailored double-breasted overcoat crafted from a rich wool blend.",
                        Img = "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500"
                    },
                    new Product {
                        Name = "Athletic Training Shorts", Brand = "Nike", Price = 35.00m, Category = "Apparel",
                        Material = "Polyester Mesh", Sizes = "S,M,L", Colors = "Black,Grey", InStock = true, Featured = false, NewArrival = false,
                        Description = "Breathable, moisture-wicking athletic shorts with zipper hand pockets.",
                        Img = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500"
                    },
                    new Product {
                        Name = "Premium Graphic Tee", Brand = "Champion", Price = 29.99m, Category = "Apparel",
                        Material = "Organic Cotton", Sizes = "S,M,L,XL", Colors = "White,Black", InStock = true, Featured = false, NewArrival = false,
                        Description = "Soft organic cotton t-shirt with a vintage-inspired screenprinted graphic.",
                        Img = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500"
                    },
                    new Product {
                        Name = "Nylon Bomber Jacket", Brand = "Levi's", Price = 99.99m, Category = "Apparel",
                        Material = "Nylon", Sizes = "S,M,L,XL", Colors = "Sage Green,Black", InStock = true, Featured = false, NewArrival = true,
                        Description = "Water-resistant nylon flight bomber jacket with utility sleeve pocket.",
                        Img = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500"
                    }
                };

                productList.AddRange(additionalProducts);
                
                await context.Products.AddRangeAsync(productList);
            }

            await context.SaveChangesAsync();
        }
    }
}
