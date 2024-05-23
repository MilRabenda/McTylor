using McTylorDB;
using McTylorDB.Models;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Reflection.Metadata.Ecma335;
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

        [HttpPost("AddCategory/{name}")]
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

        [HttpDelete("DeleteCategory/{id}")]
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

        [HttpGet("GetVerifiedPhotos")]
        public IEnumerable<Photo> GetVerifiedPhotos()
        {
            return this.database.Photos
                .Where(p => p.IsVerified)
                .OrderBy(photo => photo.Date)
                .ToList();
        }

        [HttpGet("GetUnauthorizedPhotos")]
        public IEnumerable<Photo> GetUnauthorizedPhotos()
        {
            return this.database.Photos
                .Where(p => p.IsVerified == false)
                .OrderBy(photo => photo.Date)
                .ToList();
        }

        [HttpPost("VerifyPhoto/{id}")]
        public ActionResult VerifyPhoto(int id)
        {                
            var photo = this.database.Photos.FirstOrDefault(p => p.Id == id);

                if(photo == null)
                   return BadRequest("No photo found.");

            try
            {
                photo.IsVerified = true;
                this.database.Update(photo);
                this.database.SaveChanges();

                return Ok("Photo verified");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
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
                newPhoto.TemporaryPath = "";

                this.database.Photos.Add(newPhoto);
                this.database.SaveChanges();

                return Ok(new { filePath, date });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("CopyPhotosToTemporary")]
        public async Task<IActionResult> CopyPhotosToTemporary()
        {
            var photos = GetPhotos();
            if (photos == null)
                return BadRequest("No photos fetched.");

            try
            {
                var temporaryDir = "D:/McTylor/McTylorWebsite/src/assets/temporary";
                Directory.CreateDirectory("D:/McTylor/McTylorWebsite/src/assets/temporary");

                foreach (var photo in photos)
                {
                    var fileName = Path.GetFileName(photo.Path);
                    var sourceFilePath = photo.Path;
                    var destinationFilePath = Path.Combine(temporaryDir, fileName);

                    if (System.IO.File.Exists(sourceFilePath))
                    {
                        System.IO.File.Copy(sourceFilePath, destinationFilePath, true);
                    }

                    photo.TemporaryPath = fileName;
                }

                return Ok(new { message = "Photos copied successfully!", photos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
