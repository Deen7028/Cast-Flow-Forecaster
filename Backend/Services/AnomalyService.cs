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

        return anomalies.Select(a => {
            var dto = new AnomalyAlertDto
            {
                Id = a.nIAnomaliesId.ToString(),
                Severity = a.sSeverity,
                Title = a.sTitle,
                Description = a.sDescription,
                Date = a.dDetectedAt?.ToString("MMM dd, yyyy") ?? string.Empty,
                TransactionId = a.nTransactionId,
                Tags = new List<AnomalyTagDto> { new AnomalyTagDto { Label = a.sType } }
            };

            // สำหรับ Missing Fixed Cost ให้ดึงข้อมูลจาก Recurring Rule มาใส่เพื่อช่วยในการกดบันทึกต่อ
            if (a.sType == "Missing Fixed Cost")
            {
                var ruleName = a.sTitle.Replace("Missing Fixed Cost: ", "");
                var rule = _context.tbRecurringRules.FirstOrDefault(r => r.sName == ruleName);
                if (rule != null)
                {
                    dto.SuggestedAmount = rule.nAmount;
                    dto.SuggestedCategoryId = rule.nCategoryId;
                    dto.RecurringRuleId = rule.nRecurringRulesId;
                }
            }

            return dto;
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
                Description = "ตรวจสอบรายการคงที่ (Recurring) หากไม่พบการบันทึกหลังจากวันครบกำหนด",
                IsActive = settings?.isCheckFixedCost ?? true,
                FixedCostAlertDay = settings?.nFixedCostAlertDay ?? 3
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
            case "rule_fixed":
                if (dto.FixedCostAlertDay.HasValue)
                {
                    settings.nFixedCostAlertDay = dto.FixedCostAlertDay.Value;
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

    public void RunDetection(bool forceRedetect = false)
    {
        var settings = _context.tmSystemSettings.FirstOrDefault();
        if (settings == null) return;

        // ถ้าสั่ง force ให้ล้างรายการที่เคยรีวิวไปแล้วออก เพื่อให้ระบบตรวจเจอใหม่
        if (forceRedetect)
        {
            var reviewedAnomalies = _context.tbAnomalies.Where(a => a.isReviewed == true).ToList();
            _context.tbAnomalies.RemoveRange(reviewedAnomalies);
            _context.SaveChanges();
        }

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
                    tx.isAnomaly = true;
                    if (!_context.tbAnomalies.Any(a => a.nTransactionId == tx.nTransactionsId && a.sType == "Expense Spike" && a.isReviewed == false))
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

                // คำนวณวันครบกำหนด (Due Date) + ระยะเวลาผ่อนผัน (Grace Period)
                var gracePeriod = settings.nFixedCostAlertDay ?? 3; // ค่าเริ่มต้น 3 วันหลังจากวันครบกำหนด
                var dueDate = rule.nDayOfMonth ?? 1; // ถ้าไม่ได้ระบุให้เป็นวันที่ 1
                var alertDay = dueDate + gracePeriod;

                if (!exists && DateTime.UtcNow.Day > alertDay)
                {
                    var title = $"Missing Fixed Cost: {rule.sName}";
                    if (!_context.tbAnomalies.Any(a => a.sTitle == title && a.dDetectedAt >= startOfMonth && a.isReviewed == false))
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

        // 3. Duplicate Transaction Detection (Always Active) - Optimized logic
        var recentTransactionsForDup = _context.tbTransactions
            .Where(t => t.isActive == true && t.dTransactionDate >= DateTime.UtcNow.AddDays(-3))
            .ToList();

        foreach (var tx in recentTransactionsForDup)
        {
            // หาในรายการที่ดึงมาแล้ว (In-memory) เพื่อไม่ให้โหลด Database หนัก
            var hasDuplicate = recentTransactionsForDup.Any(t => 
                t.nTransactionsId != tx.nTransactionsId && 
                t.nAmount == tx.nAmount && 
                t.sDescription == tx.sDescription &&
                Math.Abs((t.dTransactionDate - tx.dTransactionDate).TotalHours) <= 24);

            if (hasDuplicate)
            {
                var title = $"Possible Duplicate: {tx.sDescription}";
                if (!_context.tbAnomalies.Any(a => a.nTransactionId == tx.nTransactionsId && a.sType == "Duplicate" && a.isReviewed == false))
                {
                    _context.tbAnomalies.Add(new tbAnomalies
                    {
                        sTitle = title,
                        sDescription = $"พบรายการที่มีมูลค่าและคำอธิบายเดียวกัน (฿{tx.nAmount:N0}) ในเวลาใกล้เคียงกัน ({tx.dTransactionDate:HH:mm}) กรุณาตรวจสอบว่าเป็นรายการซ้ำหรือไม่",
                        sSeverity = "MEDIUM",
                        sType = "Duplicate",
                        nTransactionId = tx.nTransactionsId,
                        dDetectedAt = DateTime.UtcNow,
                        isReviewed = false
                    });
                }
            }
        }

        // --- AUTO-RESOLVE: Mark alerts as reviewed if they are no longer valid ---
        
        // 4. Resolve Fixed Expense Spikes
        var activeSpikes = _context.tbAnomalies.Where(a => a.sType == "Expense Spike" && a.isReviewed == false).ToList();
        foreach (var alert in activeSpikes)
        {
            var tx = _context.tbTransactions.Find(alert.nTransactionId);
            if (tx == null || tx.isActive == false)
            {
                alert.isReviewed = true;
                alert.sDescription += " (System Resolved: Transaction removed)";
                continue;
            }

            var threshold = settings.nSpikeThreshold ?? 2.5m;
            var avg = _context.tbTransactions
                .Where(t => t.isActive == true && t.nCategoryId == tx.nCategoryId && t.nTransactionsId != tx.nTransactionsId)
                .Average(t => (decimal?)t.nAmount) ?? 0;

            if (avg == 0 || tx.nAmount <= (avg * threshold))
            {
                tx.isAnomaly = false;
                alert.isReviewed = true;
                alert.sDescription += " (System Resolved: Amount corrected)";
            }
        }

        // 5. Resolve Fixed Missing Fixed Costs
        var activeMissingCosts = _context.tbAnomalies.Where(a => a.sType == "Missing Fixed Cost" && a.isReviewed == false).ToList();
        foreach (var alert in activeMissingCosts)
        {
            var ruleName = alert.sTitle.Replace("Missing Fixed Cost: ", "");
            var rule = _context.tbRecurringRules.FirstOrDefault(r => r.sName == ruleName && r.isActive == true);
            
            if (rule == null) {
                alert.isReviewed = true;
                alert.sDescription += " (System Resolved: Rule removed)";
                continue;
            }

            var startOfMonth = new DateTime(alert.dDetectedAt?.Year ?? DateTime.UtcNow.Year, alert.dDetectedAt?.Month ?? DateTime.UtcNow.Month, 1);
            var exists = _context.tbTransactions
                .Any(t => t.isActive == true && t.nRecurringRuleId == rule.nRecurringRulesId && t.dTransactionDate >= startOfMonth);

            if (exists)
            {
                alert.isReviewed = true;
                alert.sDescription += " (System Resolved: Transaction recorded)";
            }
        }

        // 6. Resolve Fixed Duplicates
        var activeDuplicates = _context.tbAnomalies.Where(a => a.sType == "Duplicate" && a.isReviewed == false).ToList();
        foreach (var alert in activeDuplicates)
        {
            var tx = _context.tbTransactions.Find(alert.nTransactionId);
            if (tx == null || tx.isActive == false)
            {
                alert.isReviewed = true;
                alert.sDescription += " (System Resolved: Transaction removed)";
                continue;
            }

            var hasDuplicate = _context.tbTransactions
                .Any(t => t.isActive == true &&
                       t.nTransactionsId != tx.nTransactionsId &&
                       t.nAmount == tx.nAmount &&
                       t.sDescription == tx.sDescription &&
                       t.dTransactionDate >= tx.dTransactionDate.AddHours(-24) &&
                       t.dTransactionDate <= tx.dTransactionDate.AddHours(24));

            if (!hasDuplicate)
            {
                alert.isReviewed = true;
                alert.sDescription += " (System Resolved: Duplicate resolved)";
            }
        }

        _context.SaveChanges();
    }
}
