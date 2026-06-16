using System.Collections.Generic;

namespace Ecommerce.Application.DTOs
{
    public class OrderCreateDto
    {
        public string Id { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public string Status { get; set; } = "Confirmed";
        public string Payment { get; set; } = "Paid";
        public string? PaymentId { get; set; }
        public string Date { get; set; } = string.Empty;
        public int Items { get; set; }
        public OrderAddressDto Address { get; set; } = new OrderAddressDto();
        public List<OrderItemDto> Products { get; set; } = new List<OrderItemDto>();
    }
}
