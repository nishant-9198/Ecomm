using System;
using System.Collections.Generic;

namespace Ecommerce.Application.DTOs
{
    public class OrderDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Payment { get; set; } = string.Empty;
        public string? PaymentId { get; set; }
        public string Date { get; set; } = string.Empty; // Formatted date string for frontend e.g. "6/16/2026"
        public int Items { get; set; } // Sum of product quantities or counts
        public OrderAddressDto Address { get; set; } = new OrderAddressDto();
        public List<OrderItemDto> Products { get; set; } = new List<OrderItemDto>();
    }
}
