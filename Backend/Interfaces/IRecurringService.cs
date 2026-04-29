using Backend.DTOs.Recurring;
using Backend.Data.Entities;


namespace Backend.Interfaces;

public interface IRecurringService
{
    IEnumerable<RecurringRuleDto> GetAll();
    RecurringRuleDto? GetById(int id);
    RecurringRuleDto Create(CreateRecurringRuleDto dto);
    bool Delete(int id);
    IEnumerable<tbTransactions> GetHistory(int id);
    bool BulkUpdateStatus(List<int> ids, bool isActive);
    bool BulkDelete(List<int> ids);
}
