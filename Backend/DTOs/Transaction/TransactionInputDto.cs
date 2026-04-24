namespace Backend.DTOs.Transaction
{
    public class TransactionInputDto
    {
        public int nId { get; set; }
        public string sDescription { get; set; } = string.Empty;
        public decimal nAmount { get; set; }
        public string sType { get; set; } = "Expense";
        public DateTime dDate { get; set; }
        public int nTagId { get; set; }
    }
}