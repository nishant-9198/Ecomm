using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Ecommerce.Application.DTOs;
using Ecommerce.Domain.Repositories;

namespace Ecommerce.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<UserDto?> GetUserByIdAsync(string id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto?> GetUserByMobileAsync(string mobile)
        {
            var user = await _unitOfWork.Users.GetByMobileAsync(mobile);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _unitOfWork.Users.GetAllAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<UserDto?> UpdateProfileAsync(string userId, UserDto dto)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null) return null;

            user.Name = dto.Name;
            user.Email = dto.Email;
            user.Address = dto.Address;
            
            if (!string.IsNullOrEmpty(dto.Img))
            {
                user.Img = dto.Img;
            }

            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<UserDto>(user);
        }
    }
}
