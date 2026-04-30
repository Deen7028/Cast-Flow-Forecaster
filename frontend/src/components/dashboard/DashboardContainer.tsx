'use client';

import React from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { KpiCard } from './KpiCard';
import { CashFlowChart } from './CashFlowChart';
import { ScenarioPanel } from './ScenarioPanel';
import { RecentTransactions } from './RecentTransactions';
import { RecurringEngine } from './RecurringEngine';

export const DashboardContainer = () => {
    return (
        <Box sx={{ pb: 4 }}>
            {/* Top Row: KPI Cards */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <KpiCard 
                        sTitle="CASH BALANCE (NOW)"
                        sValue="฿4,820,500"
                        sValueColor="#00e5a0"
                        sTopBorderColor="#00e5a0"
                        sSubtextPrefix="↑ +12.4%"
                        sSubtextPrefixColor="#00e5a0"
                        sSubtextSuffix="vs last month"
                        sBottomLeftText="Safety buffer"
                        nProgress={74}
                        sProgressColor="#00e5a0"
                        sBottomRightText="74%"
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <KpiCard 
                        sTitle="PROJECTED (30 DAYS)"
                        sValue="฿5,340,200"
                        sValueColor="#3d9eff"
                        sTopBorderColor="#3d9eff"
                        sSubtextPrefix="↑ +10.8%"
                        sSubtextPrefixColor="#3d9eff"
                        sSubtextSuffix="forecast"
                        sBottomLeftText="Confidence"
                        nProgress={82}
                        sProgressColor="#3d9eff"
                        sBottomRightText="82%"
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <KpiCard 
                        sTitle="TOTAL EXPENSES (MTD)"
                        sValue="฿1,245,000"
                        sValueColor="#ff4d6d"
                        sTopBorderColor="#ff4d6d"
                        sSubtextPrefix="↓ -8.1%"
                        sSubtextPrefixColor="#ff4d6d"
                        sSubtextSuffix="month-to-date"
                        sBottomLeftText="vs Budget"
                        nProgress={91}
                        sProgressColor="#f5c542"
                        sBottomRightText="91%"
                        sBottomRightColor="#f5c542"
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <KpiCard 
                        sTitle="BURN RATE / DAY"
                        sValue="฿41,500"
                        sValueColor="#f5c542"
                        sTopBorderColor="#f5c542"
                        sSubtextSuffix="Runway: 110 days"
                        sBottomLeftText="Risk level"
                        sBottomRightText="LOW"
                        sBottomRightColor="#00e5a0"
                        nProgress={15}
                        sProgressColor="#00e5a0"
                    />
                </Grid>
            </Grid>

            {/* Middle Row: Chart & Scenario */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <CashFlowChart />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <ScenarioPanel />
                </Grid>
            </Grid>

            {/* Bottom Row: Transactions & Recurring */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <RecentTransactions />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <RecurringEngine />
                </Grid>
            </Grid>
        </Box>
    );
};
