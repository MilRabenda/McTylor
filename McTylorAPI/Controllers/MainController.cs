using McTylorAPI.Classes;
using McTylorDB;
using McTylorDB.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;
using static System.Net.Mime.MediaTypeNames;

namespace McTylorAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]

    public class MainController : ControllerBase
    {
        private readonly McTylorContext database;
        private readonly EmailSettings emailSettings;

        public MainController(McTylorContext context, IOptions<EmailSettings> emailSettings)
        {
            this.database = context;
            this.emailSettings = emailSettings.Value;
        }

        //---------------- Category ----------------

        [HttpGet("GetCategories")]
        [AllowAnonymous]
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

        [HttpPost("EditCategory/{id}")]
        public async Task<IActionResult> EditCategoryName(int id, [FromQuery] string newName)
        {
            if (string.IsNullOrWhiteSpace(newName))
            {
                return BadRequest("Category name cannot be empty.");
            }

            try
            {
                var category = await this.database.Categories.FindAsync(id);
                if (category == null)
                {
                    return NotFound("Category not found.");
                }

                category.Name = newName;

                this.database.Categories.Update(category);
                await this.database.SaveChangesAsync();

                return Ok(category);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteCategory/{id}")]
        public ActionResult DeleteCategory(int id)
        {
            var category = this.database.Categories.FirstOrDefault(c => c.Id == id);
            if (category == null)
            {
                return NotFound("Category not found.");
            }

            var photos = this.database.Photos.Where(p => p.CategoryId == id).ToList();
            var users = this.database.Users.Where(u => u.CategoryId == id).ToList();

            if (photos.Count > 0 || users.Count > 0)
            {
                return BadRequest("Cannot delete a category with photos or users in it.");
            }

            try
            {
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

        [HttpGet("GetArchivedPhotos")]
        public IEnumerable<ArchivedPhoto> GetArchivedPhotos()
        {
            return this.database.ArchivedPhoto
                .OrderBy(photo => photo.ArchivedDate)
                .ToList();
        }

        [HttpPost("VerifyPhoto/{id}")]
        public ActionResult VerifyPhoto(int id, [FromQuery] string reasonOfArchive)
        {                
            var photo = this.database.Photos.FirstOrDefault(p => p.Id == id);

                if(photo == null)
                   return BadRequest("No photo found.");

            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token.");
            }
            var userId = int.Parse(userIdClaim.Value);

            try
            {
                photo.IsVerified = true;

                ArchivedPhoto archivedPhoto = new ArchivedPhoto();
                archivedPhoto.ArchivedDate = DateTime.Now;
                archivedPhoto.TemporaryPath = photo.TemporaryPath;
                archivedPhoto.Path = photo.Path;
                archivedPhoto.Longitude = photo.Longitude;
                archivedPhoto.Latitude = photo.Latitude;
                archivedPhoto.CategoryId = photo.CategoryId;
                archivedPhoto.Comment = photo.Comment;
                archivedPhoto.ReasonOfArchive = reasonOfArchive;
                archivedPhoto.CreationDate = photo.Date;
                archivedPhoto.UserId = userId;
                archivedPhoto.PhotoId = photo.Id;

                this.database.Update(photo);
                this.database.ArchivedPhoto.Add(archivedPhoto);
                this.database.SaveChanges();

                return Ok("Photo verified");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("AddPhoto")]
        [AllowAnonymous]
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

                var users = this.database.Users.Where(u => u.CategoryId == Convert.ToInt32(categoryId)).ToList();
                await Task.WhenAll(users.Select(user => SendEmailNotification(user.Email)));

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

        [HttpGet("SendEmailNotification")]
        [AllowAnonymous]
        public async Task SendEmailNotification(string email)
        {
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(emailSettings.smtpUser);
            mailMessage.To.Add(email);
            mailMessage.Subject = "Nowe zgłoszenie";
            mailMessage.Body = "Na serwerze pojawiło się nowe zgłoszenie w Twojej kategorii.";
            mailMessage.IsBodyHtml = false;  

            SmtpClient smtpClient = new SmtpClient(emailSettings.smtpServer, emailSettings.smtpPort);
            smtpClient.Credentials = new NetworkCredential(emailSettings.smtpUser, emailSettings.smtpPass);
            smtpClient.EnableSsl = true;  

            try
            {
                await smtpClient.SendMailAsync(mailMessage);
                Console.WriteLine("Email sent successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error sending email: " + ex.Message);
            }
        }
    }
}
