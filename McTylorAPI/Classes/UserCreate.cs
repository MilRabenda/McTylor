using System.ComponentModel.DataAnnotations;

namespace McTylorAPI.Classes
{
    public class UserCreate
    {

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Role { get; set; }
    }
}
