using Backend.DTOs.Transaction;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _objService;

        public TransactionsController(ITransactionService objService)
        {
            _objService = objService;
        }

        [HttpGet]
        public IActionResult Get() => Ok(_objService.GetTransactions());

        [HttpGet("categories")]
        public IActionResult GetCategories() => Ok(_objService.GetCategories());

        [HttpGet("recurring-rules")]
        public IActionResult GetRecurringRules() => Ok(_objService.GetRecurringRules());

        [HttpPost("categories")]
        public IActionResult PostCategory([FromBody] CategoryInputDto objReq)
        {
            try
            {
                return Ok(_objService.SaveCategory(objReq));
            }
            catch (Exception objEx)
            {
                return BadRequest(new { status = "error", message = objEx.Message });
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] TransactionInputDto objReq)
        {
            try
            {
                return Ok(_objService.SaveTransaction(objReq));
            }
            catch (Exception objEx)
            {
                return BadRequest(new { status = "error", message = objEx.Message });
            }
        }
        [HttpDelete("{nId}")]
        public IActionResult Delete(int nId)
        {
            try
            {
                return Ok(_objService.DeleteTransaction(nId));
            }
            catch (Exception objEx)
            {
                return BadRequest(new { status = "error", message = objEx.Message });
            }
        }
    }
}
