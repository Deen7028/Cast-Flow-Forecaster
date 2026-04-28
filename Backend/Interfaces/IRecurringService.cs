using Backend.DTOs.Recurring;
using Data.Entities;


namespace Backend.Interfaces;

public interface IRecurringService
{
    Task<IEnumerable<RecurringRuleDto>> GetAllAsync();
    Task<RecurringRuleDto?> GetByIdAsync(int id);
    Task<RecurringRuleDto> CreateAsync(CreateRecurringRuleDto dto);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<tbTransactions>> GetHistoryAsync(int id);
    Task<bool> BulkUpdateStatusAsync(List<int> ids, bool isActive);
    Task<bool> BulkDeleteAsync(List<int> ids);
}
