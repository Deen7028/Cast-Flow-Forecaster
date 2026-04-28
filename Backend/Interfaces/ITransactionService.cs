using Backend.DTOs.Transaction;

namespace Backend.Interfaces
{
    public interface ITransactionService
    {
        object GetTransactions();
        object GetCategories();
        object SaveTransaction(TransactionInputDto objReq);
        object SaveCategory(CategoryInputDto objReq);
        object DeleteTransaction(int nTransactionsId);
        object GetRecurringRules();
    }
}