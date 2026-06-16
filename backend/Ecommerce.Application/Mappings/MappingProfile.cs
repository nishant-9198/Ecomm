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
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => string.IsNullOrEmpty(src.Date) ? DateTime.UtcNow : DateTime.Parse(src.Date, CultureInfo.InvariantCulture)))
                .ForMember(dest => dest.ShippingName, opt => opt.MapFrom(src => src.Address.Name))
                .ForMember(dest => dest.ShippingHouse, opt => opt.MapFrom(src => src.Address.House))
                .ForMember(dest => dest.ShippingAddress1, opt => opt.MapFrom(src => src.Address.Address1))
                .ForMember(dest => dest.ShippingCity, opt => opt.MapFrom(src => src.Address.City))
                .ForMember(dest => dest.ShippingState, opt => opt.MapFrom(src => src.Address.State))
                .ForMember(dest => dest.ShippingCountry, opt => opt.MapFrom(src => src.Address.Country))
                .ForMember(dest => dest.Products, opt => opt.MapFrom(src => src.Products));
        }
    }
}
