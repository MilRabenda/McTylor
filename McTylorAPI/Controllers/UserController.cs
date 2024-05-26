using McTylorDB.Models;
using McTylorDB;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using McTylorAPI.Classes;

namespace McTylorAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly McTylorContext databse;

        public UserController(McTylorContext context)
        {
            databse = context;
        }

        [HttpPost("AddUser")]
        [AllowAnonymous]
        public async Task<IActionResult> AddUser([FromBody] UserCreate newUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new User
            {
                Username = newUser.Username,
                Password = newUser.Password,
                Email = newUser.Email,
                Role = newUser.Role,
            };

            databse.Users.Add(user);
            await databse.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await databse.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
    }
}
