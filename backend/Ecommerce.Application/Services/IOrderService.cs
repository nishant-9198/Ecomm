using System.Collections.Generic;
using System.Threading.Tasks;
using Ecommerce.Application.DTOs;

namespace Ecommerce.Application.Services
{
    public interface IOrderService
    {
        Task<OrderDto?> GetOrderByIdAsync(string id);
        Task<IEnumerable<OrderDto>> GetOrdersByUserIdAsync(string userId);
        Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
        Task<OrderDto> CreateOrderAsync(string userId, OrderCreateDto dto);
        Task<OrderDto?> UpdateOrderStatusAsync(string orderId, string status);
    }
}
