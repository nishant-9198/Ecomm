using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Ecommerce.Domain.Repositories;
using Ecommerce.Persistence.Data;
using Ecommerce.Persistence.Repositories;

namespace Ecommerce.Persistence
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
        {
            var dbProvider = configuration["DatabaseProvider"] ?? "SqlServer";

            if (dbProvider.Equals("PostgreSQL", System.StringComparison.OrdinalIgnoreCase))
            {
                var connectionString = configuration.GetConnectionString("PostgresConnection");
                connectionString = ConvertPostgresUriToConnectionString(connectionString);

                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseNpgsql(connectionString));
            }
            else
            {
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
            }

            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            return services;
        }

        private static string ConvertPostgresUriToConnectionString(string connectionString)
        {
            if (string.IsNullOrEmpty(connectionString)) return connectionString;

            if (connectionString.StartsWith("postgres://", System.StringComparison.OrdinalIgnoreCase) ||
                connectionString.StartsWith("postgresql://", System.StringComparison.OrdinalIgnoreCase))
            {
                var databaseUri = new System.Uri(connectionString);
                var userInfo = databaseUri.UserInfo.Split(':');

                var username = userInfo[0];
                var password = userInfo.Length > 1 ? userInfo[1] : "";
                var host = databaseUri.Host;
                var port = databaseUri.Port == -1 ? 5432 : databaseUri.Port;
                var databaseName = databaseUri.LocalPath.TrimStart('/');

                return $"Host={host};Port={port};Database={databaseName};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true;";
            }

            return connectionString;
        }
    }
}
