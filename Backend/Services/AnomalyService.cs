using Backend.DTOs;
using Backend.Interfaces;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class AnomalyService : IAnomalyService
{
    private readonly WebAppDbContext _context;

    public AnomalyService(WebAppDbContext context)
    {
        _context = context;
    }

    public IEnumerable<AnomalyAlertDto> GetAlerts()
    {
        var anomalies = _context.tbAnomalies
            .Where(a => a.isReviewed != true)
            .OrderByDescending(a => a.dDetectedAt)
            .ToList();

        return anomalies.Select(a => new AnomalyAlertDto
        {
            Id = a.nIAnomaliesId.ToString(),
            Severity = a.sSeverity,
            Title = a.sTitle,
            Description = a.sDescription,
            Date = a.dDetectedAt?.ToString("MMM dd, yyyy") ?? string.Empty,
            TransactionId = a.nTransactionId,
            Tags = new List<AnomalyTagDto> { new AnomalyTagDto { Label = a.sType } }
        });
    }

    public IEnumerable<DetectionRuleDto> GetRules()
    {
        var settings = _context.tmSystemSettings.FirstOrDefault();

        return new List<DetectionRuleDto>
        {
            new DetectionRuleDto {
                Id = "rule_spike",
                Title = "Expense Spike Detection",
                Description = $"แจ้งเตือนเมื่อรายจ่ายสูงกว่าค่าเฉลี่ย {settings?.nSpikeThreshold ?? 2.5m} เท่า",
                IsActive = settings?.isEnableSpike ?? true,
                Threshold = settings?.nSpikeThreshold ?? 2.5m
            },
            new DetectionRuleDto {
                Id = "rule_fixed",
                Title = "Missing Fixed Cost Alert",
                Description = "ตรวจสอบ Recurring Rules หากไม่พบรายการบันทึกตามกำหนด",
                IsActive = settings?.isCheckFixedCost ?? true
            }
        };
    }

    public bool ToggleRule(string id, bool isActive)
    {
        var settings = _context.tmSystemSettings.FirstOrDefault();
        if (settings == null) return false;

        switch (id)
        {
            case "rule_spike": settings.isEnableSpike = isActive; break;
            case "rule_fixed": settings.isCheckFixedCost = isActive; break;
        }

        _context.SaveChanges();
        return true;
    }

    public bool UpdateRuleParameters(string id, UpdateRuleParametersDto dto)
    {
        var settings = _context.tmSystemSettings.FirstOrDefault();
        if (settings == null) return false;

        switch (id)
        {
            case "rule_spike":
                if (dto.Threshold.HasValue)
                {
                    settings.nSpikeThreshold = dto.Threshold.Value;
                }
                break;
                // เพิ่ม Rule อื่นๆ ที่นี่ในอนาคต
        }

        _context.SaveChanges();
        return true;
    }

    public bool MarkAsReviewed(int id)
    {
        var anomaly = _context.tbAnomalies.Find(id);
        if (anomaly == null) return false;

        anomaly.isReviewed = true;
        _context.SaveChanges();
        return true;
    }

    public void RunDetection()
    {
        var settings = _context.tmSystemSettings.FirstOrDefault();
        if (settings == null) return;

        // 1. Expense Spike Detection
        if (settings.isEnableSpike == true)
        {
            var threshold = settings.nSpikeThreshold ?? 2.5m;
            var recentTransactions = _context.tbTransactions
                .Where(t => t.isActive == true && t.sType == "Expense" && t.dTransactionDate >= DateTime.UtcNow.AddDays(-7))
                .ToList();

            foreach (var tx in recentTransactions)
            {
                var avg = _context.tbTransactions
                    .Where(t => t.isActive == true && t.nCategoryId == tx.nCategoryId && t.nTransactionsId != tx.nTransactionsId)
                    .Average(t => (decimal?)t.nAmount) ?? 0;

                if (avg > 0 && tx.nAmount > (avg * threshold))
                {
                    // Update Transaction Flag
                    tx.isAnomaly = true;

                    // Check if alert already exists
                    if (!_context.tbAnomalies.Any(a => a.nTransactionId == tx.nTransactionsId && a.sType == "Expense Spike"))
                    {
                        _context.tbAnomalies.Add(new tbAnomalies
                        {
                            sTitle = $"Expense Spike: {tx.sDescription}",
                            sDescription = $"รายจ่ายในหมวดนี้สูงกว่าค่าเฉลี่ย {threshold} เท่า (Amount: ฿{tx.nAmount:N0}, Avg: ฿{avg:N0})",
                            sSeverity = "MEDIUM",
                            sType = "Expense Spike",
                            nTransactionId = tx.nTransactionsId,
                            dDetectedAt = DateTime.UtcNow,
                            isReviewed = false
                        });
                    }
                }
            }
        }

        // 2. Missing Fixed Cost Detection
        if (settings.isCheckFixedCost == true)
        {
            var activeRules = _context.tbRecurringRules
                .Where(r => r.isActive == true && r.dStartDate <= DateTime.UtcNow)
                .ToList();

            foreach (var rule in activeRules)
            {
                var startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
                var exists = _context.tbTransactions
                    .Any(t => t.isActive == true && t.nRecurringRuleId == rule.nRecurringRulesId && t.dTransactionDate >= startOfMonth);

                if (!exists && DateTime.UtcNow.Day > 10)
                {
                    var title = $"Missing Fixed Cost: {rule.sName}";
                    if (!_context.tbAnomalies.Any(a => a.sTitle == title && a.dDetectedAt >= startOfMonth))
                    {
                        _context.tbAnomalies.Add(new tbAnomalies
                        {
                            sTitle = title,
                            sDescription = $"ไม่พบรายการจ่ายสำหรับ '{rule.sName}' ในเดือนนี้ คาดว่าอาจจะลืมบันทึกหรือมียอดค้างชำระ",
                            sSeverity = "HIGH",
                            sType = "Missing Fixed Cost",
                            dDetectedAt = DateTime.UtcNow,
                            isReviewed = false
                        });
                    }
                }
            }
        }

        _context.SaveChanges();
    }
}
