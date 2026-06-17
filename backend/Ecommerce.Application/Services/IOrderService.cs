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
        Task<PagedResponse<OrderDto>> GetPagedOrdersAsync(string userId, string role, int page, int pageSize);
        Task<OrderDto> CreateOrderAsync(string userId, OrderCreateDto dto);
        Task<OrderDto?> UpdateOrderStatusAsync(string orderId, string status);
    }
}
