using Backend.Interfaces;
using Backend.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<tmCategories>> GetAll()
    {
        var categories = _categoryService.GetAll();
        return Ok(categories);
    }
}
