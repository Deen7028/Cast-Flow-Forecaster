'use client';

import React from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CircleIcon from '@mui/icons-material/Circle';

const data = [
    { name: 'Jul 1', baseline: 3600000, forecast: 3600000 },
    { name: 'Jul 15', baseline: 4000000, forecast: 4000000 },
    { name: 'Aug 1', baseline: 4400000, forecast: 4400000 },
    { name: 'Aug 15', baseline: 4700000, forecast: 4800000, isAnomaly: true },
    { name: 'Sep 1', baseline: 5100000, forecast: 5300000 },
    { name: 'Sep 30', baseline: 5600000, forecast: 5900000 }
];

export const CashFlowChart = () => {
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
                    <AreaChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
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
                        />
                        <ReferenceLine x="Aug 1" stroke="#3d4560" strokeDasharray="3 3" label={{ position: 'top', value: 'TODAY', fill: '#3d4560', fontSize: 12 }} />
                        <Area type="monotone" dataKey="baseline" stroke="#7a8499" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                        <Area type="monotone" dataKey="forecast" stroke="#00e5a0" strokeWidth={3} fillOpacity={1} fill="url(#colorForecast)" activeDot={{ r: 6, fill: '#00e5a0', stroke: '#fff' }} />
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
