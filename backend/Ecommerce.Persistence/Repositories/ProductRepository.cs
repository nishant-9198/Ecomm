using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Repositories;
using Ecommerce.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Persistence.Repositories
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category)
        {
            return await _context.Products
                .Where(p => p.Category == category)
                .ToListAsync();
        }

        public async Task<IEnumerable<string>> GetCategoriesAsync()
        {
            return await _context.Products
                .Where(p => p.Category != null)
                .Select(p => p.Category!)
                .Distinct()
                .ToListAsync();
        }

        public async Task<(IEnumerable<Product> Items, int TotalCount)> GetPagedProductsAsync(
            int page, int pageSize, string? search, string? category, string? brand, 
            decimal? minPrice, decimal? maxPrice, int? rating, bool? inStock, string? sortBy)
        {
            var query = _context.Products.AsQueryable();

            // Search filter
            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(term) || 
                                         (p.Description != null && p.Description.ToLower().Contains(term)));
            }

            // Category filter
            if (!string.IsNullOrWhiteSpace(category) && !category.Equals("ALL", System.StringComparison.OrdinalIgnoreCase))
            {
                var cat = category.Trim().ToLower();
                query = query.Where(p => p.Category != null && p.Category.ToLower() == cat);
            }

            // Brand filter
            if (!string.IsNullOrWhiteSpace(brand))
            {
                var b = brand.Trim().ToLower();
                query = query.Where(p => p.Brand != null && p.Brand.ToLower() == b);
            }

            // Price filter
            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }
            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            // Availability filter
            if (inStock.HasValue)
            {
                query = query.Where(p => p.InStock == inStock.Value);
            }

            // Rating filter (via subquery on Reviews)
            if (rating.HasValue)
            {
                query = query.Where(p => 
                    (!_context.Reviews.Any(r => r.ProductId == p.Id) && rating.Value <= 4) ||
                    (_context.Reviews.Any(r => r.ProductId == p.Id) && 
                     _context.Reviews.Where(r => r.ProductId == p.Id).Average(r => r.Rating) >= (double)rating.Value)
                );
            }

            // Sorting
            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                switch (sortBy.ToLower())
                {
                    case "price_asc":
                        query = query.OrderBy(p => p.Price);
                        break;
                    case "price_desc":
                        query = query.OrderByDescending(p => p.Price);
                        break;
                    case "newest":
                        query = query.OrderByDescending(p => p.CreatedAt);
                        break;
                    default:
                        query = query.OrderByDescending(p => p.Id);
                        break;
                }
            }
            else
            {
                query = query.OrderByDescending(p => p.Id);
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }
    }
}
