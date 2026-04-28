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

        [HttpPost]
        public IActionResult Post([FromBody] TransactionInputDto req)
        {
            try
            {
                return Ok(_objService.SaveTransaction(req));
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = "error", message = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                return Ok(_objService.DeleteTransaction(id));
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = "error", message = ex.Message });
            }
        }
    }
}