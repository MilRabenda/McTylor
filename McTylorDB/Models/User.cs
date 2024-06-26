﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace McTylorDB.Models
{
    [Table("User")]
    public class User
    {
        public int Id { get; set; }

        [ForeignKey("CategoryId")]
        public int? CategoryId { get; set; }

        [Required]
        public string Username { get; set; }
            
        [Required]
        public string Password { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Role { get; set; }

        public ICollection<ArchivedPhoto> ArchivedPhoto { get; } = new List<ArchivedPhoto>();

    }
}
