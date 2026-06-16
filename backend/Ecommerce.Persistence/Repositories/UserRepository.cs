using System.Threading.Tasks;
using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Repositories;
using Ecommerce.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Persistence.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByMobileAsync(string mobile)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Mobile == mobile);
        }
    }
}
