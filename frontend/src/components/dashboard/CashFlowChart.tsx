'use client';

import React, { useMemo } from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import dayjs from 'dayjs';
import { ITransaction } from '@/interfaces';

interface Props {
    lstTransactions?: ITransaction[];
    nCurrentBalance?: number;
}

export const CashFlowChart = ({ lstTransactions = [], nCurrentBalance = 0 }: Props) => {
    const chartData = useMemo(() => {
        if (!lstTransactions.length) return [];

        const lstSorted = [...lstTransactions].sort((a, b) => dayjs(a.dDate).unix() - dayjs(b.dDate).unix());
        
        const dataMap = new Map<string, number>();
        let currentTotal = 0; 

        lstSorted.forEach(tx => {
            const dateStr = dayjs(tx.dDate).format('MMM DD');
            const isIncome = tx.sType?.toUpperCase() === 'INCOME';
            currentTotal += isIncome ? tx.nAmount : -tx.nAmount;
            dataMap.set(dateStr, currentTotal);
        });

        const offset = nCurrentBalance - currentTotal;

        const result = [];
        for (const [dateStr, val] of dataMap.entries()) {
            const absoluteVal = val + offset;
            result.push({
                name: dateStr,
                baseline: absoluteVal,
                forecast: absoluteVal, // Simple projection
            });
        }

        // Add a simple 30-day forecast point if we have data
        if (result.length > 0) {
            const lastVal = result[result.length - 1].baseline;
            result.push({
                name: dayjs().add(30, 'day').format('MMM DD'),
                baseline: null,
                forecast: lastVal * 1.05 // +5% mock forecast
            });
        }

        return result;
    }, [lstTransactions, nCurrentBalance]);

    return (
        <Paper sx={{ p: 3, bgcolor: '#0e1117', border: '1px solid #1c2233', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShowChartIcon sx={{ color: '#00e5a0' }} />
                    <Typography variant="subtitle1" sx={{ color: '#fff' }}>Cumulative Cash Flow</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label="All" size="small" sx={{ bgcolor: 'rgba(0, 229, 160, 0.1)', color: '#00e5a0', border: '1px solid #00e5a0' }} />
                    <Chip label="ProjectA" size="small" variant="outlined" sx={{ color: '#7a8499', borderColor: '#1c2233' }} />
                    <Chip label="ProjectB" size="small" variant="outlined" sx={{ color: '#3d4560', borderColor: '#1c2233', opacity: 0.5 }} />
                    <Chip label="SaaS" size="small" variant="outlined" sx={{ color: '#f5c542', borderColor: '#f5c542' }} />
                    <Chip label="Baseline" size="small" sx={{ bgcolor: '#00e5a0', color: '#000', fontWeight: 'bold' }} />
                    <Chip label="What-If" size="small" variant="outlined" sx={{ color: '#3d9eff', borderColor: '#3d9eff' }} />
                </Box>
            </Box>

            <Box sx={{ flexGrow: 1, minHeight: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00e5a0" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#00e5a0" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1c2233" vertical={false} />
                        <XAxis dataKey="name" stroke="#3d4560" tick={{ fill: '#7a8499', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis stroke="#3d4560" tick={{ fill: '#7a8499', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${(val/1000000).toFixed(1)}M`} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0e1117', borderColor: '#1c2233', color: '#fff', borderRadius: 8 }}
                            itemStyle={{ color: '#00e5a0' }}
                            formatter={(val: number) => `฿${val.toLocaleString()}`}
                        />
                        <ReferenceLine x={dayjs().format('MMM DD')} stroke="#3d4560" strokeDasharray="3 3" label={{ position: 'top', value: 'TODAY', fill: '#3d4560', fontSize: 12 }} />
                        <Area type="monotone" dataKey="baseline" stroke="#7a8499" strokeWidth={2} strokeDasharray="5 5" fill="none" connectNulls />
                        <Area type="monotone" dataKey="forecast" stroke="#00e5a0" strokeWidth={3} fillOpacity={1} fill="url(#colorForecast)" activeDot={{ r: 6, fill: '#00e5a0', stroke: '#fff' }} connectNulls />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, pt: 2, borderTop: '1px solid #1c2233' }}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 12, height: 3, bgcolor: '#00e5a0' }} />
                        <Typography variant="caption" sx={{ color: '#7a8499' }}>Baseline</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 12, height: 3, bgcolor: '#00e5a0' }} />
                        <Typography variant="caption" sx={{ color: '#7a8499' }}>Forecast (projected)</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 12, height: 3, bgcolor: '#3d9eff' }} />
                        <Typography variant="caption" sx={{ color: '#7a8499' }}>What-If Scenario</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 12, height: 3, bgcolor: '#f5c542' }} />
                        <Typography variant="caption" sx={{ color: '#7a8499' }}>Anomaly Point</Typography>
                    </Box>
                </Box>
                <Typography variant="caption" sx={{ color: '#3d4560' }}>Updated: 2 min ago</Typography>
            </Box>
        </Paper>
    );
};
