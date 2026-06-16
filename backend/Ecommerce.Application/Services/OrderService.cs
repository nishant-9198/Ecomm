using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Ecommerce.Application.DTOs;
using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Repositories;

namespace Ecommerce.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public OrderService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<OrderDto?> GetOrderByIdAsync(string id)
        {
            var order = await _unitOfWork.Orders.GetOrderWithItemsByIdAsync(id);
            return _mapper.Map<OrderDto>(order);
        }

        public async Task<IEnumerable<OrderDto>> GetOrdersByUserIdAsync(string userId)
        {
            var orders = await _unitOfWork.Orders.GetOrdersByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<OrderDto>>(orders);
        }

        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            var orders = await _unitOfWork.Orders.GetAllOrdersWithItemsAsync();
            return _mapper.Map<IEnumerable<OrderDto>>(orders);
        }

        public async Task<OrderDto> CreateOrderAsync(string userId, OrderCreateDto dto)
        {
            var order = _mapper.Map<Order>(dto);
            order.UserId = userId;

            // Enforce ID generation if missing
            if (string.IsNullOrEmpty(order.Id))
            {
                order.Id = "ORD" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            }

            await _unitOfWork.Orders.AddAsync(order);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<OrderDto>(order);
        }

        public async Task<OrderDto?> UpdateOrderStatusAsync(string orderId, string status)
        {
            var order = await _unitOfWork.Orders.GetOrderWithItemsByIdAsync(orderId);
            if (order == null) return null;

            order.Status = status;
            _unitOfWork.Orders.Update(order);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<OrderDto>(order);
        }
    }
}
