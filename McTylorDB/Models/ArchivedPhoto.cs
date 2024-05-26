using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace McTylorDB.Models
{
    [Table("ArchivedPhoto")]
    public class ArchivedPhoto
    {
        public int Id { get; set; }

        public int PhotoId { get; set; }

        public int CategoryId { get; set; }

        [Required]
        public string Path { get; set; }

        public string TemporaryPath { get; set; }

        [Required]
        public DateTime CreationDate { get; set; }

        [Required]
        public DateTime ArchivedDate { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string Comment { get; set; }

        public string ReasonOfArchive { get; set; }

        public int UserId { get; set; }
    }
}
