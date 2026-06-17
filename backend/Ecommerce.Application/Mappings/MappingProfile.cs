using AutoMapper;
using Ecommerce.Domain.Entities;
using Ecommerce.Application.DTOs;
using System;
using System.Globalization;

namespace Ecommerce.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User Mapping
            CreateMap<User, UserDto>().ReverseMap();

            // Product Mapping
            CreateMap<Product, ProductDto>().ReverseMap();
            CreateMap<ProductCreateDto, Product>();

            // OrderItem Mapping
            // Note: ProductId in entity maps to Id in DTO (to match frontend shape)
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ProductId))
                .ReverseMap()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            // Order Mapping
            CreateMap<Order, OrderDto>()
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date.ToString("M/d/yyyy", CultureInfo.InvariantCulture)))
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Products.Count))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => new OrderAddressDto
                {
                    Name = src.ShippingName,
                    House = src.ShippingHouse,
                    Address1 = src.ShippingAddress1,
                    City = src.ShippingCity,
                    State = src.ShippingState,
                    Country = src.ShippingCountry
                }));

            CreateMap<OrderCreateDto, Order>()
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => ParseDateSafely(src.Date)))
                .ForMember(dest => dest.ShippingName, opt => opt.MapFrom(src => src.Address.Name))
                .ForMember(dest => dest.ShippingHouse, opt => opt.MapFrom(src => src.Address.House))
                .ForMember(dest => dest.ShippingAddress1, opt => opt.MapFrom(src => src.Address.Address1))
                .ForMember(dest => dest.ShippingCity, opt => opt.MapFrom(src => src.Address.City))
                .ForMember(dest => dest.ShippingState, opt => opt.MapFrom(src => src.Address.State))
                .ForMember(dest => dest.ShippingCountry, opt => opt.MapFrom(src => src.Address.Country))
                .ForMember(dest => dest.Products, opt => opt.MapFrom(src => src.Products));
        }

        private static DateTime ParseDateSafely(string dateStr)
        {
            if (string.IsNullOrEmpty(dateStr))
            {
                return DateTime.UtcNow;
            }

            // Try InvariantCulture
            if (DateTime.TryParse(dateStr, CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
            {
                return date;
            }

            // Try common formats explicitly (e.g. dd/MM/yyyy used in India, yyyy-MM-dd, etc.)
            string[] formats = { "dd/MM/yyyy", "d/M/yyyy", "dd-MM-yyyy", "d-M-yyyy", "yyyy-MM-dd", "MM/dd/yyyy" };
            if (DateTime.TryParseExact(dateStr, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out date))
            {
                return date;
            }

            // Try parsing using local system default
            if (DateTime.TryParse(dateStr, out date))
            {
                return date;
            }

            return DateTime.UtcNow; // Safe fallback
        }
    }
}
