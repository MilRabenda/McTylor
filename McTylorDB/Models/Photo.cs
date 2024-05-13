using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace McTylorDB.Models
{
    [Table("Photo")]
    public class Photo
    {
        public int Id { get; set; }

        public int CategoryId { get; set; }

        [Required]
        public string Path { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string Comment { get; set; }

    }
}
