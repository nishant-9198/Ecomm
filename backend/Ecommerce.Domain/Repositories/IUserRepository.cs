using System.Threading.Tasks;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Domain.Repositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByMobileAsync(string mobile);
    }
}
