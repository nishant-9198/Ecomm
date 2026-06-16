using System.Collections.Generic;
using System.Threading.Tasks;
using Ecommerce.Application.DTOs;

namespace Ecommerce.Application.Services
{
    public interface IUserService
    {
        Task<UserDto?> GetUserByIdAsync(string id);
        Task<UserDto?> GetUserByMobileAsync(string mobile);
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto?> UpdateProfileAsync(string userId, UserDto dto);
    }
}
