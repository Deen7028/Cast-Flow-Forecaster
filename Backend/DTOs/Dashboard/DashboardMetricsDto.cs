namespace Backend.DTOs.Dashboard
{
    public class DashboardMetricsDto
    {
        public decimal nCashBalance { get; set; }
        public decimal nProjected30Days { get; set; }
        public decimal nTotalExpensesMTD { get; set; }
        public decimal nBurnRatePerDay { get; set; }
        public decimal nCashBalanceDiffPercent { get; set; }
        public decimal nProjectedDiffPercent { get; set; }
        public decimal nExpensesDiffPercent { get; set; }
        public int nSafetyBufferPercent { get; set; }
        public int nConfidencePercent { get; set; }
        public int nBudgetPercent { get; set; }
        public int nRunwayDays { get; set; }
        public string sRiskLevel { get; set; } = "LOW";
    }
}
