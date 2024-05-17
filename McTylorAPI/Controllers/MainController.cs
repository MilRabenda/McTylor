using McTylorDB;
using McTylorDB.Models;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using static System.Net.Mime.MediaTypeNames;

namespace McTylorAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MainController : ControllerBase
    {
        private readonly McTylorContext database;

        public MainController(McTylorContext context)
        {
            this.database = context;
        }

        //---------------- Category ----------------


        [HttpGet("GetCategories")]
        public IEnumerable<Category> GetCategories()
        {
            return this.database.Categories.ToList();
        }

        [HttpPost("AddCategory")]
        public ActionResult AddCategory(string name)
        {
            try
            {
                Category newCategory = new Category()
                {
                    Name = name
                };

                this.database.Categories.Add(newCategory);
                this.database.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteCategory")]
        public ActionResult DeleteCategory(int id)
        {
            try
            {
                var category = this.database.Categories.FirstOrDefault(c => c.Id == id);
                this.database.Categories.Remove(category);
                this.database.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //---------------- Photo ----------------

        [HttpGet("GetPhotos")]
        public IEnumerable<Photo> GetPhotos()
        {
            return this.database.Photos
                .OrderBy(photo => photo.Date)
                    .ToList();
        }

        [HttpPost("AddPhoto")]
        public async Task<IActionResult> AddPhoto([FromForm] IFormFile picture, [FromForm] string latitude, 
            [FromForm] string longitude, [FromForm] string date, [FromForm] string categoryId, [FromForm] string comment)
        {
            if (picture == null || picture.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(picture.FileName);
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads", fileName);

                Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads"));

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await picture.CopyToAsync(stream);
                }

                Photo newPhoto = new Photo();
                newPhoto.CategoryId = Convert.ToInt32(categoryId);
                newPhoto.Path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads", fileName);
                newPhoto.Latitude = Double.Parse(latitude, CultureInfo.InvariantCulture);
                newPhoto.Longitude = Double.Parse(longitude, CultureInfo.InvariantCulture);
                newPhoto.Date = Convert.ToDateTime(date);
                newPhoto.Comment = comment;

                this.database.Photos.Add(newPhoto);
                this.database.SaveChanges();

                return Ok(new { filePath, date });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
