using Microsoft.EntityFrameworkCore;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Persistence.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<Notification> Notifications => Set<Notification>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User Entity Configurations
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.HasIndex(u => u.Mobile).IsUnique();
                entity.Property(u => u.Mobile).IsRequired().HasMaxLength(20);
                entity.Property(u => u.Name).IsRequired().HasMaxLength(100);
                entity.Property(u => u.Role).IsRequired().HasMaxLength(20);
            });

            // Product Entity Configurations
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
                entity.Property(p => p.Price).HasColumnType("numeric(18,2)");
            });

            // Order Entity Configurations
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(o => o.Id);
                entity.Property(o => o.UserId).IsRequired();
                entity.Property(o => o.Total).HasColumnType("numeric(18,2)");
                entity.Property(o => o.Status).HasMaxLength(50);
                entity.Property(o => o.Payment).HasMaxLength(50);
                entity.Property(o => o.PaymentId).HasMaxLength(100);

                // Shipping address configuration
                entity.Property(o => o.ShippingName).IsRequired().HasMaxLength(100);
                entity.Property(o => o.ShippingHouse).IsRequired().HasMaxLength(100);
                entity.Property(o => o.ShippingAddress1).IsRequired().HasMaxLength(250);
                entity.Property(o => o.ShippingCity).IsRequired().HasMaxLength(100);
                entity.Property(o => o.ShippingState).IsRequired().HasMaxLength(100);
                entity.Property(o => o.ShippingCountry).IsRequired().HasMaxLength(100);

                // Relationships
                entity.HasMany(o => o.Products)
                      .WithOne()
                      .HasForeignKey(oi => oi.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // OrderItem Entity Configurations
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(oi => oi.Id);
                entity.Property(oi => oi.Name).IsRequired().HasMaxLength(200);
                entity.Property(oi => oi.Price).HasColumnType("numeric(18,2)");
            });

            // Review Entity Configurations
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Comment).IsRequired().HasMaxLength(1000);
                entity.Property(r => r.UserName).IsRequired().HasMaxLength(100);
            });

            // Notification Entity Configurations
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(n => n.Id);
                entity.Property(n => n.Message).IsRequired().HasMaxLength(500);
            });
        }
    }
}
