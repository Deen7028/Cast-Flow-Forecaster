namespace Backend.DTOs.Transaction
{
    public class TransactionInputDto
    {
        public int nTransactionsId { get; set; }
        public string sDescription { get; set; } = string.Empty;
        public decimal nAmount { get; set; }
        public required string sType { get; set; }
        public DateTime dDate { get; set; }
        public int nTagId { get; set; }
        public int nCategoryId { get; set; }
        public required string sStatus { get; set; }
        public int nRecurringRuleId { get; set; }
    }
}