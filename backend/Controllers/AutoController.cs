using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly JwtService _jwtService;

        public AuthController(JwtService jwtService)
        {
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDTO loginDto)
        {
            if (
                loginDto.Email == "admin@smartoffer.com"
                && loginDto.Password == "admin123"
            )
            {
                var token = _jwtService.GenerateToken(
                    loginDto.Email,
                    "Admin"
                );

                return Ok(new
                {
                    message = "Login successful",
                    token = token
                });
            }

            return Unauthorized(new
            {
                message = "Invalid email or password"
            });
        }
    }
}