'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { KpiCard } from './KpiCard';
import { CashFlowChart } from './CashFlowChart';
import { ScenarioPanel } from './ScenarioPanel';
import { RecentTransactions } from './RecentTransactions';
import { RecurringEngine } from './RecurringEngine';
import { AnomalyAlerts } from './AnomalyAlerts';
import { dashboardService, anomalyService, transactionService } from '@/services';
import { IDashboardMetrics, IAnomaly, ITransaction, IRecurringRule } from '@/interfaces';

export const DashboardContainer = () => {
    const [objMetrics, setObjMetrics] = useState<IDashboardMetrics | null>(null);
    const [lstAnomalies, setLstAnomalies] = useState<IAnomaly[]>([]);
    const [lstTransactions, setLstTransactions] = useState<ITransaction[]>([]);
    const [lstRecurringRules, setLstRecurringRules] = useState<IRecurringRule[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [resMetrics, resAnomalies, resTransactions, resRecurring] = await Promise.all([
                dashboardService.getMetrics(),
                anomalyService.getActive(),
                transactionService.getAll(),
                transactionService.getRecurringRules()
            ]);

            if (resMetrics.status === 'success') {
                setObjMetrics(resMetrics.data as IDashboardMetrics);
            }
            if (resAnomalies.status === 'success') {
                setLstAnomalies(resAnomalies.data as IAnomaly[]);
            }
            if (resTransactions.status === 'success') {
                setLstTransactions(resTransactions.data as ITransaction[]);
            }
            if (resRecurring.status === 'success') {
                setLstRecurringRules(resRecurring.data as IRecurringRule[]);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, [fetchData]);

    const handleReviewAnomaly = async (nId: number) => {
        try {
            const res = await anomalyService.markAsReviewed(nId);
            if (res.status === 'success') {
                setLstAnomalies(prev => prev.filter(a => a.nIAnomaliesId !== nId));
            }
        } catch (error) {
            console.error('Failed to review anomaly', error);
        }
    };

    if (isLoading && !objMetrics) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    const metrics = objMetrics || {
        nCashBalance: 0,
        nProjected30Days: 0,
        nTotalExpensesMTD: 0,
        nBurnRatePerDay: 0,
        nCashBalanceDiffPercent: 0,
        nProjectedDiffPercent: 0,
        nExpensesDiffPercent: 0,
        nSafetyBufferPercent: 0,
        nConfidencePercent: 0,
        nBudgetPercent: 0,
        nRunwayDays: 0,
        sRiskLevel: 'LOW'
    };

    return (
        <Box sx={{ pb: 4 }}>
            {/* Top Notifications */}
            <AnomalyAlerts lstAnomalies={lstAnomalies} onReview={handleReviewAnomaly} />

            {/* Top Row: KPI Cards */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <KpiCard 
                        sTitle="CASH BALANCE (NOW)"
                        sValue={`฿${metrics.nCashBalance.toLocaleString()}`}
                        sValueColor="#00e5a0"
                        sTopBorderColor="#00e5a0"
                        sSubtextPrefix={`${metrics.nCashBalanceDiffPercent >= 0 ? '↑' : '↓'} ${Math.abs(metrics.nCashBalanceDiffPercent)}%`}
                        sSubtextPrefixColor={metrics.nCashBalanceDiffPercent >= 0 ? "#00e5a0" : "#ff4d6d"}
                        sSubtextSuffix="vs last month"
                        sBottomLeftText="Safety buffer"
                        nProgress={metrics.nSafetyBufferPercent}
                        sProgressColor="#00e5a0"
                        sBottomRightText={`${metrics.nSafetyBufferPercent}%`}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <KpiCard 
                        sTitle="PROJECTED (30 DAYS)"
                        sValue={`฿${metrics.nProjected30Days.toLocaleString()}`}
                        sValueColor="#3d9eff"
                        sTopBorderColor="#3d9eff"
                        sSubtextPrefix={`↑ +${metrics.nProjectedDiffPercent}%`}
                        sSubtextPrefixColor="#3d9eff"
                        sSubtextSuffix="forecast"
                        sBottomLeftText="Confidence"
                        nProgress={metrics.nConfidencePercent}
                        sProgressColor="#3d9eff"
                        sBottomRightText={`${metrics.nConfidencePercent}%`}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <KpiCard 
                        sTitle="TOTAL EXPENSES (MTD)"
                        sValue={`฿${metrics.nTotalExpensesMTD.toLocaleString()}`}
                        sValueColor="#ff4d6d"
                        sTopBorderColor="#ff4d6d"
                        sSubtextPrefix={`${metrics.nExpensesDiffPercent >= 0 ? '↑' : '↓'} ${Math.abs(metrics.nExpensesDiffPercent)}%`}
                        sSubtextPrefixColor={metrics.nExpensesDiffPercent <= 0 ? "#00e5a0" : "#ff4d6d"}
                        sSubtextSuffix="month-to-date"
                        sBottomLeftText="vs Budget"
                        nProgress={metrics.nBudgetPercent}
                        sProgressColor="#f5c542"
                        sBottomRightText={`${metrics.nBudgetPercent}%`}
                        sBottomRightColor="#f5c542"
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <KpiCard 
                        sTitle="BURN RATE / DAY"
                        sValue={`฿${metrics.nBurnRatePerDay.toLocaleString()}`}
                        sValueColor="#f5c542"
                        sTopBorderColor="#f5c542"
                        sSubtextSuffix={`Runway: ${metrics.nRunwayDays} days`}
                        sBottomLeftText="Risk level"
                        sBottomRightText={metrics.sRiskLevel}
                        sBottomRightColor={metrics.sRiskLevel === 'LOW' ? "#00e5a0" : (metrics.sRiskLevel === 'MEDIUM' ? "#f5c542" : "#ff4d6d")}
                        nProgress={metrics.sRiskLevel === 'LOW' ? 15 : (metrics.sRiskLevel === 'MEDIUM' ? 50 : 85)}
                        sProgressColor={metrics.sRiskLevel === 'LOW' ? "#00e5a0" : (metrics.sRiskLevel === 'MEDIUM' ? "#f5c542" : "#ff4d6d")}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <CashFlowChart lstTransactions={lstTransactions} nCurrentBalance={metrics.nCashBalance} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <ScenarioPanel />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <RecentTransactions lstTransactions={lstTransactions} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <RecurringEngine lstRecurringRules={lstRecurringRules} />
                </Grid>
            </Grid>
        </Box>
    );
};
