using System;
using System.Threading.Tasks;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Domain.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        IProductRepository Products { get; }
        IOrderRepository Orders { get; }
        IGenericRepository<Review> Reviews { get; }
        IGenericRepository<Notification> Notifications { get; }
        Task<int> CompleteAsync();
    }
}
