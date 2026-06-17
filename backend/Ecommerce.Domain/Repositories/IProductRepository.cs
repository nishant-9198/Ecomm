using System.Collections.Generic;
using System.Threading.Tasks;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Domain.Repositories
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category);
        Task<IEnumerable<string>> GetCategoriesAsync();
        Task<(IEnumerable<Product> Items, int TotalCount)> GetPagedProductsAsync(
            int page, int pageSize, string? search, string? category, string? brand, 
            decimal? minPrice, decimal? maxPrice, int? rating, bool? inStock, string? sortBy);
    }
}
