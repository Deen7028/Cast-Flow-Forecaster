using Backend.DTOs.Transaction;

namespace Backend.Interfaces
{
    public interface ITransactionService
    {
        object GetTransactions();
        object SaveTransaction(TransactionInputDto req);
    }
}