'use client';

import React from 'react';
import { Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const data = [
    { id: 1, desc: 'Client A - Sprint 12', subDesc: 'ProjectA - USD 8,500', amount: '+฿301,750', isPositive: true, date: 'Aug 02', status: 'Confirmed', statusColor: '#00e5a0' },
    { id: 2, desc: 'AWS Infrastructure', subDesc: 'SaaS - Spike 1.2x', amount: '-฿113,600', isPositive: false, date: 'Aug 01', status: 'Review', statusColor: '#f5c542', hasWarning: true },
    { id: 3, desc: 'Engineering Payroll', subDesc: 'Recurring - Monthly', amount: '-฿680,000', isPositive: false, date: 'Jul 31', status: 'Confirmed', statusColor: '#00e5a0' },
];

export const RecentTransactions = () => {
    return (
        <Paper sx={{ p: 3, bgcolor: '#0e1117', border: '1px solid #1c2233', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ReceiptIcon sx={{ color: '#3d9eff', fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ color: '#fff' }}>Recent Transactions</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#3d4560', cursor: 'pointer', '&:hover': { color: '#fff' } }}>Income</Typography>
                    <Typography variant="caption" sx={{ color: '#3d4560', cursor: 'pointer', '&:hover': { color: '#fff' } }}>Expense</Typography>
                    <Box sx={{ bgcolor: '#1c2233', px: 1.5, py: 0.5, borderRadius: 1, cursor: 'pointer' }}>
                        <Typography variant="caption" sx={{ color: '#7a8499', '&:hover': { color: '#fff' } }}>View All →</Typography>
                    </Box>
                </Box>
            </Box>

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#3d4560', borderBottom: '1px solid #1c2233', fontFamily: 'monospace', py: 2 }}>DESCRIPTION</TableCell>
                            <TableCell sx={{ color: '#3d4560', borderBottom: '1px solid #1c2233', fontFamily: 'monospace', py: 2 }} align="right">AMOUNT (THB)</TableCell>
                            <TableCell sx={{ color: '#3d4560', borderBottom: '1px solid #1c2233', fontFamily: 'monospace', py: 2 }}>DATE</TableCell>
                            <TableCell sx={{ color: '#3d4560', borderBottom: '1px solid #1c2233', fontFamily: 'monospace', py: 2 }}>STATUS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell sx={{ borderBottom: '1px solid #1c2233', py: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" sx={{ color: '#dde3f0', fontWeight: 600 }}>{row.desc}</Typography>
                                        {row.hasWarning && <WarningAmberIcon sx={{ color: '#f5c542', fontSize: 16 }} />}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <Typography variant="caption" sx={{ color: '#7a8499' }}>📁 {row.subDesc}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right" sx={{ borderBottom: '1px solid #1c2233', py: 2 }}>
                                    <Typography variant="body2" sx={{ color: row.isPositive ? '#00e5a0' : '#ff4d6d', fontWeight: 'bold' }}>
                                        {row.amount}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid #1c2233', py: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#7a8499' }}>{row.date}</Typography>
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid #1c2233', py: 2 }}>
                                    <Chip 
                                        label={`● ${row.status}`} 
                                        size="small" 
                                        sx={{ 
                                            bgcolor: 'transparent', 
                                            color: row.statusColor, 
                                            border: `1px solid ${row.statusColor}`, 
                                            height: 24,
                                            '& .MuiChip-label': { px: 1 }
                                        }} 
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};
