using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Ecommerce.Application.DTOs;
using Ecommerce.Application.Interfaces;
using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Repositories;

namespace Ecommerce.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IUploadService _uploadService;

        public ProductService(IUnitOfWork unitOfWork, IMapper mapper, IUploadService uploadService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _uploadService = uploadService;
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            return _mapper.Map<ProductDto>(product);
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _unitOfWork.Products.GetAllAsync();
            return _mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(string category)
        {
            var products = await _unitOfWork.Products.GetProductsByCategoryAsync(category);
            return _mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<IEnumerable<string>> GetCategoriesAsync()
        {
            return await _unitOfWork.Products.GetCategoriesAsync();
        }

        public async Task<PagedResponse<ProductDto>> GetPagedProductsAsync(
            int page, int pageSize, string? search, string? category, string? brand, 
            decimal? minPrice, decimal? maxPrice, int? rating, bool? inStock, string? sortBy)
        {
            var (items, totalCount) = await _unitOfWork.Products.GetPagedProductsAsync(
                page, pageSize, search, category, brand, minPrice, maxPrice, rating, inStock, sortBy);

            var mappedItems = _mapper.Map<IEnumerable<ProductDto>>(items);
            return new PagedResponse<ProductDto>(mappedItems, page, pageSize, totalCount);
        }

        public async Task<ProductDto> CreateProductAsync(ProductCreateDto dto)
        {
            var product = _mapper.Map<Product>(dto);
            
            // Handle Base64 file upload if required
            if (dto.Img != null && dto.Img.StartsWith("data:image"))
            {
                var fileName = $"product_{Guid.NewGuid()}.jpg";
                product.Img = await _uploadService.UploadAsync(dto.Img, fileName);
            }

            await _unitOfWork.Products.AddAsync(product);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<ProductDto>(product);
        }

        public async Task<ProductDto?> UpdateProductAsync(int id, ProductCreateDto dto)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null) return null;

            // Map all properties from DTO to entity
            _mapper.Map(dto, product);

            // Handle Base64 file upload if required
            if (dto.Img != null && dto.Img.StartsWith("data:image"))
            {
                var fileName = $"product_{id}_{Guid.NewGuid()}.jpg";
                product.Img = await _uploadService.UploadAsync(dto.Img, fileName);
            }

            _unitOfWork.Products.Update(product);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<ProductDto>(product);
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null) return false;

            _unitOfWork.Products.Delete(product);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
