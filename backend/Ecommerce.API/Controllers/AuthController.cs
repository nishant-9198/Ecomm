using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Ecommerce.Application.Services;
using Ecommerce.Application.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Ecommerce.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
        {
            await _authService.SendOtpAsync(request);
            return Ok(new { Message = "OTP sent successfully ✅" });
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            var response = await _authService.VerifyOtpAsync(request);
            return Ok(response);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequest request)
        {
            var response = await _authService.RefreshTokenAsync(request);
            return Ok(response);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var identity = User.Identity as ClaimsIdentity;
            var mobile = identity?.FindFirst(ClaimTypes.MobilePhone)?.Value;
            
            if (string.IsNullOrEmpty(mobile))
            {
                return BadRequest("Invalid user details.");
            }

            await _authService.RevokeTokenAsync(mobile);
            return Ok(new { Message = "Logged out successfully ✅" });
        }
    }
}
