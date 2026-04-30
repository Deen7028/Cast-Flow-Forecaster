using Backend.DTOs.Dashboard;
using Backend.Interfaces;
using Data.Context;
using System;
using System.Linq;

namespace Backend.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly WebAppDbContext _objContext;

        public DashboardService(WebAppDbContext objContext)
        {
            _objContext = objContext;
        }

        public DashboardMetricsDto GetDashboardMetrics()
        {
            var dNow = DateTime.Now;
            var dStartOfMonth = new DateTime(dNow.Year, dNow.Month, 1);
            var dLastMonthStart = dStartOfMonth.AddMonths(-1);
            var dLastMonthEnd = dStartOfMonth.AddDays(-1);

            // 1. ดึงรายการที่ Active ทั้งหมดมาก่อน (รวมทุกสถานะ)
            var lstAllTransactions = _objContext.tbTransactions.Where(x => x.isActive == true).ToList();

            // 2. แยกตะกร้าเฉพาะบิลที่ "เสร็จสมบูรณ์แล้ว" เพื่อคำนวณ Cash Balance & MTD
            var lstCompletedTx = lstAllTransactions.Where(x => x.sStatus == "Completed").ToList();

            // ---------------------------------------------------------
            // ส่วนที่ 1: CASH BALANCE (ใช้ตะกร้าที่เสร็จแล้ว)
            // ---------------------------------------------------------
            var nIncomeTotal = lstCompletedTx.Where(x => x.sType.ToUpper() == "INCOME").Sum(x => x.nAmount);
            var nExpenseTotal = lstCompletedTx.Where(x => x.sType.ToUpper() == "EXPENSE").Sum(x => x.nAmount);
            var nCashBalance = nIncomeTotal - nExpenseTotal;

            // Last Month Balance for comparison
            var nIncomeLastMonth = lstCompletedTx.Where(x => x.sType.ToUpper() == "INCOME" && x.dTransactionDate <= dLastMonthEnd).Sum(x => x.nAmount);
            var nExpenseLastMonth = lstCompletedTx.Where(x => x.sType.ToUpper() == "EXPENSE" && x.dTransactionDate <= dLastMonthEnd).Sum(x => x.nAmount);
            var nCashBalanceLastMonth = nIncomeLastMonth - nExpenseLastMonth;

            var nCashBalanceDiffPercent = nCashBalanceLastMonth != 0
                ? ((nCashBalance - nCashBalanceLastMonth) / Math.Abs(nCashBalanceLastMonth)) * 100
                : 0;

            // ---------------------------------------------------------
            // ส่วนที่ 2: TOTAL EXPENSES (MTD) (ใช้ตะกร้าที่เสร็จแล้ว)
            // ---------------------------------------------------------
            var nTotalExpensesMTD = lstCompletedTx
                .Where(x => x.sType.ToUpper() == "EXPENSE" && x.dTransactionDate >= dStartOfMonth && x.dTransactionDate <= dNow)
                .Sum(x => x.nAmount);

            var nTotalExpensesLastMonthMTD = lstCompletedTx
                .Where(x => x.sType.ToUpper() == "EXPENSE" && x.dTransactionDate >= dLastMonthStart && x.dTransactionDate <= dLastMonthStart.AddDays(dNow.Day - 1))
                .Sum(x => x.nAmount);

            var nExpensesDiffPercent = nTotalExpensesLastMonthMTD != 0
                ? ((nTotalExpensesMTD - nTotalExpensesLastMonthMTD) / nTotalExpensesLastMonthMTD) * 100
                : 0;

            // ---------------------------------------------------------
            // ส่วนที่ 3: BURN RATE / DAY (MTD)
            // ---------------------------------------------------------
            var nDaysInMonthPassed = dNow.Day;
            var nBurnRatePerDay = nDaysInMonthPassed > 0 ? nTotalExpensesMTD / nDaysInMonthPassed : 0;

            // ---------------------------------------------------------
            // ส่วนที่ 4: PROJECTED (30 DAYS) (ใช้บิลทั้งหมด เพื่อหาตัวที่ค้างอยู่)
            // ---------------------------------------------------------
            var dNext30Days = dNow.AddDays(30);

            var nPendingIncome = lstAllTransactions
                .Where(x => x.sType.ToUpper() == "INCOME"
                         && x.sStatus != "Completed"
                         && x.dTransactionDate <= dNext30Days)
                .Sum(x => x.nAmount);

            var nPendingExpense = lstAllTransactions
                .Where(x => x.sType.ToUpper() == "EXPENSE"
                         && x.sStatus != "Completed"
                         && x.dTransactionDate <= dNext30Days)
                .Sum(x => x.nAmount);

            var nProjected30Days = nCashBalance + nPendingIncome - nPendingExpense;

            var nProjectedDiffPercent = nCashBalance != 0
                ? ((nProjected30Days - nCashBalance) / Math.Abs(nCashBalance)) * 100
                : 0;

            // ส่วนที่ 5: RUNWAY DAYS
            var nRunwayDays = nBurnRatePerDay > 0 ? (int)(nCashBalance / nBurnRatePerDay) : 365;

            return new DashboardMetricsDto
            {
                nCashBalance = nCashBalance,
                nProjected30Days = nProjected30Days,
                nTotalExpensesMTD = nTotalExpensesMTD,
                nBurnRatePerDay = nBurnRatePerDay,
                nCashBalanceDiffPercent = Math.Round(nCashBalanceDiffPercent, 1),
                nProjectedDiffPercent = Math.Round(nProjectedDiffPercent, 1),
                nExpensesDiffPercent = Math.Round(nExpensesDiffPercent, 1),
                nSafetyBufferPercent = 74, // Placeholder (รอทำฟอร์ม Settings)
                nConfidencePercent = 82, // Placeholder (รอทำฟอร์ม Settings)
                nBudgetPercent = 91, // Placeholder (รอทำฟอร์ม Settings)
                nRunwayDays = nRunwayDays,
                sRiskLevel = nRunwayDays < 30 ? "CRITICAL" : (nRunwayDays < 90 ? "MEDIUM" : "LOW")
            };
        }
    }
}