'use client';

import React, { useMemo, useState } from 'react';
import { Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { WarningAmber as WarningAmberIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { ITransaction } from '@/interfaces';

interface Props {
    lstTransactions?: ITransaction[];
}

type FilterType = 'All' | 'Income' | 'Expense';

export const RecentTransactions = ({ lstTransactions = [] }: Props) => {
    const router = useRouter();
    const [sFilter, setSFilter] = useState<FilterType>('All');

    // Get top 5 most recent transactions based on filter
    const lstRecent = useMemo(() => {
        return [...lstTransactions]
            .filter(tx => {
                if (sFilter === 'All') return true;
                return tx.sType?.toUpperCase() === sFilter.toUpperCase();
            })
            .sort((a, b) => dayjs(b.dDate).unix() - dayjs(a.dDate).unix())
            .slice(0, 5);
    }, [lstTransactions, sFilter]);

    return (
        <Paper sx={{ p: 3, bgcolor: '#0e1117', border: '1px solid #1c2233', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ReceiptIcon sx={{ color: '#3d9eff', fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ color: '#fff' }}>Recent Transactions</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography 
                        variant="caption" 
                        onClick={() => setSFilter('All')}
                        sx={{ color: sFilter === 'All' ? '#fff' : '#3d4560', cursor: 'pointer', fontWeight: sFilter === 'All' ? 'bold' : 'normal', '&:hover': { color: '#fff' } }}
                    >
                        All
                    </Typography>
                    <Typography 
                        variant="caption" 
                        onClick={() => setSFilter('Income')}
                        sx={{ color: sFilter === 'Income' ? '#00e5a0' : '#3d4560', cursor: 'pointer', fontWeight: sFilter === 'Income' ? 'bold' : 'normal', '&:hover': { color: '#00e5a0' } }}
                    >
                        Income
                    </Typography>
                    <Typography 
                        variant="caption" 
                        onClick={() => setSFilter('Expense')}
                        sx={{ color: sFilter === 'Expense' ? '#ff4d6d' : '#3d4560', cursor: 'pointer', fontWeight: sFilter === 'Expense' ? 'bold' : 'normal', '&:hover': { color: '#ff4d6d' } }}
                    >
                        Expense
                    </Typography>
                    <Box 
                        onClick={() => router.push('/transactions')}
                        sx={{ bgcolor: '#1c2233', px: 1.5, py: 0.5, borderRadius: 1, cursor: 'pointer', transition: 'background-color 0.2s', '&:hover': { bgcolor: '#2a334c' } }}
                    >
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
                        {lstRecent.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ borderBottom: 0, py: 4, color: '#7a8499' }}>
                                    No recent transactions
                                </TableCell>
                            </TableRow>
                        ) : (
                            lstRecent.map((row) => {
                                const isIncome = row.sType?.toUpperCase() === 'INCOME';
                                const amountFormatted = `${isIncome ? '+' : '-'}฿${row.nAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
                                const statusColor = (row.sStatus === 'Completed' || row.sStatus === 'Confirmed') ? '#00e5a0' : '#f5c542';

                                return (
                                    <TableRow key={row.nTransactionsId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell sx={{ borderBottom: '1px solid #1c2233', py: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" sx={{ color: '#dde3f0', fontWeight: 600 }}>{row.sDescription}</Typography>
                                                {row.sStatus === 'Review' && <WarningAmberIcon sx={{ color: '#f5c542', fontSize: 16 }} />}
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                <Typography variant="caption" sx={{ color: '#7a8499' }}>📁 {row.sCategoryName || 'General'} {row.sTagName ? `- ${row.sTagName}` : ''}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" sx={{ borderBottom: '1px solid #1c2233', py: 2 }}>
                                            <Typography variant="body2" sx={{ color: isIncome ? '#00e5a0' : '#ff4d6d', fontWeight: 'bold' }}>
                                                {amountFormatted}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ borderBottom: '1px solid #1c2233', py: 2 }}>
                                            <Typography variant="body2" sx={{ color: '#7a8499' }}>{dayjs(row.dDate).format('MMM DD, YYYY')}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ borderBottom: '1px solid #1c2233', py: 2 }}>
                                            <Chip 
                                                label={`● ${row.sStatus || 'Confirmed'}`} 
                                                size="small" 
                                                sx={{ 
                                                    bgcolor: 'transparent', 
                                                    color: statusColor, 
                                                    border: `1px solid ${statusColor}`, 
                                                    height: 24,
                                                    '& .MuiChip-label': { px: 1 }
                                                }} 
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};
