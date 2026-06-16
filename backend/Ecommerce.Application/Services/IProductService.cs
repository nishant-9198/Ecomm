using System.Collections.Generic;
using System.Threading.Tasks;
using Ecommerce.Application.DTOs;

namespace Ecommerce.Application.Services
{
    public interface IProductService
    {
        Task<ProductDto?> GetProductByIdAsync(int id);
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(string category);
        Task<IEnumerable<string>> GetCategoriesAsync();
        Task<ProductDto> CreateProductAsync(ProductCreateDto dto);
        Task<ProductDto?> UpdateProductAsync(int id, ProductCreateDto dto);
        Task<bool> DeleteProductAsync(int id);
    }
}
