using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagsController : ControllerBase
    {
        private readonly ITagService _objTagService;

        public TagsController(ITagService objTagService)
        {
            _objTagService = objTagService;
        }

        [HttpGet]
        public IActionResult GetTags()
        {
            try
            {
                var lstTags = _objTagService.GetTagsSummaryAsync();

                return Ok(new { status = "success", data = lstTags });
            }
            catch (Exception objEx)
            {
                return StatusCode(500, new { status = "error", message = objEx.Message });
            }
        }

        [HttpPost]
        public IActionResult SaveTag([FromBody] TagInputDto req)
        {
            try
            {
                var objResult = _objTagService.SaveTagAsync(req);
                return Ok(objResult);
            }
            catch (Exception objEx)
            {
                return StatusCode(500, new { status = "error", message = objEx.Message });
            }
        }
    }
}