using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Repositories;
using Ecommerce.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Persistence.Repositories
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        public OrderRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId)
        {
            return await _context.Orders
                .Include(o => o.Products)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.Date)
                .ToListAsync();
        }

        public async Task<Order?> GetOrderWithItemsByIdAsync(string orderId)
        {
            return await _context.Orders
                .Include(o => o.Products)
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        public async Task<IEnumerable<Order>> GetAllOrdersWithItemsAsync()
        {
            return await _context.Orders
                .Include(o => o.Products)
                .OrderByDescending(o => o.Date)
                .ToListAsync();
        }

        public async Task<(IEnumerable<Order> Items, int TotalCount)> GetPagedOrdersAsync(string? userId, int page, int pageSize)
        {
            var query = _context.Orders.Include(o => o.Products).AsQueryable();

            if (!string.IsNullOrEmpty(userId))
            {
                query = query.Where(o => o.UserId == userId);
            }

            query = query.OrderByDescending(o => o.Date);

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }
    }
}
