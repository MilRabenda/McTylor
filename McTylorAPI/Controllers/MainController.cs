using McTylorDB;
using McTylorDB.Models;
using Microsoft.AspNetCore.Mvc;

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
            return this.database.Photos.ToList();
        }

        [HttpPost("AddPhoto")]
        public ActionResult AddPhoto()
        {
            try
            {
                this.database.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
