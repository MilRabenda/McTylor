using McTylorAPI.Classes;
using McTylorDB;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static System.Net.WebRequestMethods;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly McTylorContext database;

    public AuthController(IConfiguration configuration, McTylorContext context)
    {
        database = context;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] UserLogin userLogin)
    {
        var user = database.Users.SingleOrDefault(u => u.Username == userLogin.Username && u.Password == userLogin.Password);
        if (user == null)
        {
            return Unauthorized("Invalid credentials");
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim("userID", user.Id.ToString()),
            new Claim("accountType", user.Role.ToString()),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("7e7355946837449c83f32d53cbe8f74849a36589b8b83b2e6f6a28c5e72e4e7d"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: "http://localhost:44391/",
            audience: "http://localhost:4200/",
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: creds
        );

        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
    }
}