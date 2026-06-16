using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using FluentValidation;
using Ecommerce.Application.Services;

namespace Ecommerce.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg => cfg.AddMaps(typeof(Mappings.MappingProfile).Assembly));
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IUserService, UserService>();

            return services;
        }
    }
}
