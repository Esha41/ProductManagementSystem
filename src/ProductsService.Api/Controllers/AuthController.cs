using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductsService.Api.Models;
using ProductsService.Api.Services;

namespace ProductsService.Api.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/[controller]")]
public class AuthController(IConfiguration configuration, JwtTokenGenerator tokenGenerator) : ControllerBase
{
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var authSettings = configuration.GetSection("Auth");
        var username = authSettings["Username"];
        var password = authSettings["Password"];

        if (request.Username != username || request.Password != password)
        {
            return Unauthorized(new { detail = "Invalid username or password." });
        }

        var (token, expiresAtUtc) = tokenGenerator.GenerateToken(request.Username);
        return Ok(new LoginResponse(token, expiresAtUtc));
    }
}
