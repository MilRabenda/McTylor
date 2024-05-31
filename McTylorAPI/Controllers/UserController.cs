using McTylorDB.Models;
using McTylorDB;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using McTylorAPI.Classes;
using System.Xml.Linq;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using System.Globalization;
using Microsoft.EntityFrameworkCore;

namespace McTylorAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly McTylorContext database;

        public UserController(McTylorContext context)
        {
            database = context;
        }

        [HttpPost("AddUser")]
        [AllowAnonymous]
        public async Task<IActionResult> AddUser([FromBody] UserCreate newUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingEmailUser = await database.Users
                .FirstOrDefaultAsync(u => u.Email == newUser.Email);
            if (existingEmailUser != null)
            {
                return BadRequest("Email already exists in the database.");
            }

            var existingUsernameUser = await database.Users
                .FirstOrDefaultAsync(u => u.Username == newUser.Username);
            if (existingUsernameUser != null)
            {
                return BadRequest("Username already taken.");
            }

            var user = new User
            {
                Username = newUser.Username,
                Password = newUser.Password,
                Email = newUser.Email,
                Role = newUser.Role,
                CategoryId = newUser.CategoryId
            };

            database.Users.Add(user);
            await database.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await this.database.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("GetAllUsers")]
        public ActionResult<IEnumerable<User>> GetAllUsers()
        {
            var users = this.database.Users.ToList();
            if (users == null)
            {
                return NotFound();
            }

            return Ok(users);
        }

        [HttpPost("AddUserToCategory")]
        [Authorize]
        public ActionResult AddUserToCategory(UserCategory userCategory)
        {
            try
            {
                var user = database.Users.SingleOrDefault(u => u.Id == userCategory.UserId);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                var category = database.Categories.SingleOrDefault(c => c.Id == userCategory.CategoryId);
                if (category == null)
                {
                    return NotFound("Category not found");
                }

                user.CategoryId = userCategory.CategoryId;

                this.database.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("ChangeUserCategory")]
        [Authorize]
        public ActionResult ChangeUserCategory(UserCategory userCategory)
        {
            try
            {
                 var user = database.Users.SingleOrDefault(u => u.Id == userCategory.UserId);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                var category = database.Categories.SingleOrDefault(c => c.Id == userCategory.CategoryId);

                user.CategoryId = userCategory.CategoryId;

                this.database.Update(user);
                this.database.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetUsersByCategory/{id}")]
        public ActionResult<IEnumerable<User>> GetUsersByCategory(int id)
        {
            var category = this.database.Categories.FirstOrDefault(c => c.Id == id);
            if (category == null)
                return BadRequest("No category found.");

            try
            {
                var users = this.database.Users.Where(u => u.CategoryId == id).ToList();
                if (users.Count > 0)
                {
                    return Ok(users);
                }
                else
                {
                    return BadRequest("No users found for this category");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}
