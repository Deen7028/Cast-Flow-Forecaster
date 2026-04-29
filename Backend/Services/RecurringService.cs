using Backend.DTOs.Recurring;
using Backend.Interfaces;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;


namespace Backend.Services;

public class RecurringService : IRecurringService
{
    private readonly WebAppDbContext _context;

    public RecurringService(WebAppDbContext context)
    {
        _context = context;
    }

    public IEnumerable<RecurringRuleDto> GetAll()
    {
        return _context.tbRecurringRules
            .Include(r => r.nCategory)
            .Select(r => new RecurringRuleDto
            {
                nRecurringRulesId = r.nRecurringRulesId,
                sName = r.sName,
                nAmount = r.nAmount,
                sFrequency = r.sFrequency,
                nDayOfMonth = r.nDayOfMonth,
                dStartDate = r.dStartDate,
                dEndDate = r.dEndDate,
                nCategoryId = r.nCategoryId,
                CategoryName = r.nCategory.sName,
                CategoryType = r.nCategory.sType,
                nSpikeThreshold = r.nSpikeThreshold,
                isActive = r.isActive,
                dNextRunDate = r.dNextRunDate
            })
            .ToList();
    }

    public RecurringRuleDto? GetById(int id)
    {
        return _context.tbRecurringRules
            .Include(r => r.nCategory)
            .Where(r => r.nRecurringRulesId == id)
            .Select(r => new RecurringRuleDto
            {
                nRecurringRulesId = r.nRecurringRulesId,
                sName = r.sName,
                nAmount = r.nAmount,
                sFrequency = r.sFrequency,
                nDayOfMonth = r.nDayOfMonth,
                dStartDate = r.dStartDate,
                dEndDate = r.dEndDate,
                nCategoryId = r.nCategoryId,
                CategoryName = r.nCategory.sName,
                CategoryType = r.nCategory.sType,
                nSpikeThreshold = r.nSpikeThreshold,
                isActive = r.isActive,
                dNextRunDate = r.dNextRunDate
            })
            .FirstOrDefault();
    }

    public RecurringRuleDto Create(CreateRecurringRuleDto dto)
    {
        var objRecurring = _context.tbRecurringRules.FirstOrDefault(w => w.nRecurringRulesId == dto.nRecurringRulesId);
        
        bool isNew = false;
        if (objRecurring == null)
        {
            objRecurring = new tbRecurringRules();
            objRecurring.isActive = true; 
            isNew = true;
        }

        objRecurring.sName = dto.sName;
        objRecurring.nAmount = dto.nAmount;
        objRecurring.sFrequency = dto.sFrequency;
        objRecurring.nDayOfMonth = dto.nDayOfMonth;
        objRecurring.dStartDate = dto.dStartDate;
        objRecurring.dEndDate = dto.dEndDate;
        objRecurring.nCategoryId = dto.nCategoryId;
        objRecurring.nSpikeThreshold = dto.nSpikeThreshold;

        if (dto.isActive.HasValue)
        {
            objRecurring.isActive = dto.isActive.Value;
        }

        if (isNew)
        {
            _context.tbRecurringRules.Add(objRecurring);
        }

        // Calculate Next Run Date if it's new or certain fields changed
        objRecurring.dNextRunDate = CalculateNextRunDate(objRecurring.sFrequency, objRecurring.dStartDate, objRecurring.nDayOfMonth);

         _context.SaveChanges();
        return GetById(objRecurring.nRecurringRulesId) ?? throw new Exception("Failed to save rule.");
    }

    private DateTime CalculateNextRunDate(string frequency, DateTime startDate, int? dayOfMonth)
    {
        DateTime nextDate = startDate;
        DateTime today = DateTime.Today;

        while (nextDate <= today)
        {
            switch (frequency.ToLower())
            {
                case "daily":
                    nextDate = nextDate.AddDays(1);
                    break;
                case "weekly":
                    nextDate = nextDate.AddDays(7);
                    break;
                case "monthly":
                    int day = dayOfMonth ?? startDate.Day;
                    nextDate = nextDate.AddMonths(1);
                    try
                    {
                        nextDate = new DateTime(nextDate.Year, nextDate.Month, Math.Min(day, DateTime.DaysInMonth(nextDate.Year, nextDate.Month)));
                    }
                    catch { /* Fallback if date logic fails */ }
                    break;
                case "yearly":
                    nextDate = nextDate.AddYears(1);
                    break;
                default:
                    return nextDate.AddMonths(1);
            }
        }
        return nextDate;
    }



    public bool Delete(int id)
    {
        var rule = _context.tbRecurringRules.Find(id);
        if (rule == null) return false;

        _context.tbRecurringRules.Remove(rule);
        _context.SaveChanges();
        return true;
    }

    public IEnumerable<tbTransactions> GetHistory(int id)
    {
        return _context.tbTransactions
            .Where(t => t.nRecurringRuleId == id)
            .OrderByDescending(t => t.dTransactionDate)
            .ToList();
    }

    public bool BulkUpdateStatus(List<int> ids, bool isActive)
    {
        var rules = _context.tbRecurringRules.Where(r => ids.Contains(r.nRecurringRulesId)).ToList();
        foreach (var rule in rules)
        {
            rule.isActive = isActive;
        }
        _context.SaveChanges();
        return true;
    }

    public bool BulkDelete(List<int> ids)
    {
        var rules = _context.tbRecurringRules.Where(r => ids.Contains(r.nRecurringRulesId)).ToList();
        if (rules.Any())
        {
            _context.tbRecurringRules.RemoveRange(rules);
            _context.SaveChanges();
        }
        return true;
    }


}
