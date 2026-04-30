export interface IDashboardMetrics {
    nCashBalance: number;
    nProjected30Days: number;
    nTotalExpensesMTD: number;
    nBurnRatePerDay: number;
    nCashBalanceDiffPercent: number;
    nProjectedDiffPercent: number;
    nExpensesDiffPercent: number;
    nSafetyBufferPercent: number;
    nConfidencePercent: number;
    nBudgetPercent: number;
    nRunwayDays: number;
    sRiskLevel: string;
}
