using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Ecommerce.Application.Interfaces;
using Ecommerce.Infrastructure.Security;
using Ecommerce.Infrastructure.Services;

namespace Ecommerce.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHttpContextAccessor();
            services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();

            // Register IUploadService conditionally
            var uploadProvider = configuration["UploadProvider"];
            if (uploadProvider == "Cloudinary")
            {
                services.AddScoped<IUploadService, CloudinaryService>();
            }
            else
            {
                services.AddScoped<IUploadService, LocalUploadService>();
            }

            return services;
        }
    }
}
