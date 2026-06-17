using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Ecommerce.Application.Services;
using Ecommerce.Application.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Ecommerce.API.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? search = null,
            [FromQuery] string? category = null,
            [FromQuery] string? brand = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] int? rating = null,
            [FromQuery] bool? inStock = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] bool paged = false)
        {
            if (paged)
            {
                var result = await _productService.GetPagedProductsAsync(
                    page, pageSize, search, category, brand, minPrice, maxPrice, rating, inStock, sortBy);
                return Ok(result);
            }

            var all = await _productService.GetAllProductsAsync();
            return Ok(all);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var result = await _productService.GetProductByIdAsync(id);
            if (result == null) return NotFound(new { Message = "Product not found ❌" });
            return Ok(result);
        }

        [HttpGet("category/{category}")]
        public async Task<IActionResult> GetProductsByCategory(string category)
        {
            var result = await _productService.GetProductsByCategoryAsync(category);
            return Ok(result);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var result = await _productService.GetCategoriesAsync();
            return Ok(result);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] ProductCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _productService.CreateProductAsync(dto);
            return CreatedAtAction(nameof(GetProductById), new { id = result.Id }, result);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _productService.UpdateProductAsync(id, dto);
            if (result == null) return NotFound(new { Message = "Product not found ❌" });
            return Ok(result);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var deleted = await _productService.DeleteProductAsync(id);
            if (!deleted) return NotFound(new { Message = "Product not found ❌" });
            return Ok(new { Message = "Product deleted successfully ✅" });
        }
    }
}
