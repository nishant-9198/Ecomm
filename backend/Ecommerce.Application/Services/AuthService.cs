using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Ecommerce.Application.DTOs;
using Ecommerce.Application.Interfaces;
using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Repositories;

namespace Ecommerce.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IMapper _mapper;

        public AuthService(IUnitOfWork unitOfWork, IJwtTokenGenerator jwtTokenGenerator, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _jwtTokenGenerator = jwtTokenGenerator;
            _mapper = mapper;
        }

        public async Task<bool> SendOtpAsync(SendOtpRequest request)
        {
            // For production, integrate SMS gateway here.
            // For this project, we mock OTP "000000" and log it.
            Console.WriteLine($"OTP '000000' sent successfully to: {request.Mobile}");
            var user = await _unitOfWork.Users.GetByMobileAsync(request.Mobile);
            return user != null;
        }

        public async Task<AuthResponse> VerifyOtpAsync(VerifyOtpRequest request)
        {
            if (request.Otp != "000000")
            {
                throw new UnauthorizedAccessException("Invalid OTP ❌");
            }

            var user = await _unitOfWork.Users.GetByMobileAsync(request.Mobile);

            if (user == null)
            {
                // Auto-register user
                bool isAdmin = request.Mobile == "9198004022";
                user = new User
                {
                    Mobile = request.Mobile,
                    Name = isAdmin ? "Admin" : "User",
                    Role = isAdmin ? "admin" : "user",
                    Email = isAdmin ? "admin@shopEase.com" : $"{request.Mobile}@shopEase.com",
                    Img = isAdmin ? "https://i.pravatar.cc/150?img=5" : $"https://i.pravatar.cc/150?img={new Random().Next(1, 5)}"
                };
                await _unitOfWork.Users.AddAsync(user);
            }

            // Generate JWT Tokens
            var accessToken = _jwtTokenGenerator.GenerateAccessToken(user);
            var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();

            // Save Refresh Token
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await _unitOfWork.CompleteAsync();

            return new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = _mapper.Map<UserDto>(user)
            };
        }

        public async Task<AuthResponse> RefreshTokenAsync(TokenRequest request)
        {
            // Verify and extract claims from expired access token (ignoring lifetime)
            // For simplicity, we can fetch the user based on the RefreshToken directly,
            // or pass claims. Let's find the user using the RefreshToken.
            var user = (await _unitOfWork.Users.GetAllAsync())
                .FirstOrDefault(u => u.RefreshToken == request.RefreshToken);

            if (user == null || user.RefreshTokenExpiry <= DateTime.UtcNow)
            {
                throw new UnauthorizedAccessException("Invalid or expired refresh token ❌");
            }

            // Generate new tokens
            var newAccessToken = _jwtTokenGenerator.GenerateAccessToken(user);
            var newRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();

            return new AuthResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                User = _mapper.Map<UserDto>(user)
            };
        }

        public async Task<bool> RevokeTokenAsync(string mobile)
        {
            var user = await _unitOfWork.Users.GetByMobileAsync(mobile);
            if (user == null) return false;

            user.RefreshToken = null;
            user.RefreshTokenExpiry = null;
            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
