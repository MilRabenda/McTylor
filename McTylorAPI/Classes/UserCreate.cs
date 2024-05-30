using System.ComponentModel.DataAnnotations;

namespace McTylorAPI.Classes
{
    public class UserCreate
    {

        [Required]
        [StringLength(20)]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; }

        [Required]
        public string Role { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}
