using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateAccessToken(User user);
        string GenerateRefreshToken();
    }
}
