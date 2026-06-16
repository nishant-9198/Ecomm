using System;
using System.Collections.Generic;

namespace Ecommerce.Domain.Entities
{
    public class Order
    {
        public string Id { get; set; } = string.Empty; // ORDxxxx
        public string UserId { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Processing, Shipped, Delivered, Cancelled
        public string Payment { get; set; } = "Paid";
        public string? PaymentId { get; set; } // Razorpay Payment ID
        public DateTime Date { get; set; } = DateTime.UtcNow;

        // Shipping Address Fields (Flattened or Owned)
        public string ShippingName { get; set; } = string.Empty;
        public string ShippingHouse { get; set; } = string.Empty;
        public string ShippingAddress1 { get; set; } = string.Empty;
        public string ShippingCity { get; set; } = string.Empty;
        public string ShippingState { get; set; } = string.Empty;
        public string ShippingCountry { get; set; } = string.Empty;

        public ICollection<OrderItem> Products { get; set; } = new List<OrderItem>();
    }
}
