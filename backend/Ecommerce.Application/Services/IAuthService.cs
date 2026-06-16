using System.Threading.Tasks;
using Ecommerce.Application.DTOs;

namespace Ecommerce.Application.Services
{
    public interface IAuthService
    {
        Task<bool> SendOtpAsync(SendOtpRequest request);
        Task<AuthResponse> VerifyOtpAsync(VerifyOtpRequest request);
        Task<AuthResponse> RefreshTokenAsync(TokenRequest request);
        Task<bool> RevokeTokenAsync(string mobile);
    }
}
