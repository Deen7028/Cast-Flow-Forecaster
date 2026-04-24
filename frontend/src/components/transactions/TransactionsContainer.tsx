'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Button, TextField, Select, MenuItem, InputAdornment,
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Checkbox, Chip, IconButton, Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DownloadIcon from '@mui/icons-material/Download';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CircleIcon from '@mui/icons-material/Circle';
import dayjs from 'dayjs';
import { TransactionFormDialog } from './TransactionFormDialog';
import { LogoLoader } from '../common/LogoLoader';
import { ITransaction } from '@/interfaces';

interface ITransactionDisplay {
    nId: number;
    sTitleMain: string;
    sCategory: string;
    sCatColor: string;
    sCatBg: string;
    sTagName: string;
    sTagColor: string;
    dDate: string;
    sAmount: string;
    isIncome: boolean;
    sStatus: string;
    sStatusColor: string;
    _raw: ITransaction;
}

export const TransactionsContainer = () => {
    const [sSearch, setSSearch] = useState('');
    const [lstTransactions, setLstTransactions] = useState<ITransactionDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [objStats, setObjStats] = useState({
        nTotalIncome: 0,
        nTotalExpense: 0,
        nNet: 0
    });

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [objSelectedTx, setObjSelectedTx] = useState<ITransactionDisplay | null>(null);

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        try {
            const objResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Transactions`);
            if (!objResponse.ok) throw new Error('Fetch failed');

            const objResult = await objResponse.json();

            if (objResult.status === 'success') {
                const lstRawData = objResult.data || [];

                let nIncome = 0;
                let nExpense = 0;
                lstRawData.forEach((tx: ITransaction) => {
                    const sTypeUpper = tx.sType ? tx.sType.toUpperCase() : '';
                    if (sTypeUpper === 'INCOME') nIncome += tx.nAmount;
                    else nExpense += tx.nAmount;
                });
                setObjStats({ nTotalIncome: nIncome, nTotalExpense: nExpense, nNet: nIncome - nExpense });

                const lstMapped: ITransactionDisplay[] = lstRawData.map((item: ITransaction) => {
                    const sTypeUpper = item.sType ? item.sType.toUpperCase() : '';
                    const isIncome = sTypeUpper === 'INCOME';

                    return {
                        nId: item.nId,
                        sTitleMain: item.sDescription,
                        sCategory: item.sCategoryName || (isIncome ? "Revenue" : "Expense"),
                        sCatColor: isIncome ? "#00e5a0" : "#ff4d6d",
                        sCatBg: isIncome ? "rgba(0, 229, 160, 0.1)" : "rgba(255, 77, 109, 0.1)",
                        sTagName: item.sTagName || "Untagged",
                        sTagColor: item.sTagColor || "#7a8499",
                        dDate: dayjs(item.dDate).format('YYYY-MM-DD'),
                        sAmount: `${isIncome ? '+' : '-'}฿${item.nAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                        isIncome: isIncome,
                        sStatus: item.sStatus || "Confirmed",
                        sStatusColor: item.sStatus === "Completed" || item.sStatus === "Confirmed" ? "#00e5a0" : "#ffcc00",
                        _raw: item
                    };
                });

                setLstTransactions(lstMapped);
            }
        } catch (error) {
            console.error('Failed to fetch transactions', error);
        } finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTransactions();
    }, [fetchTransactions]);

    const handleAddNew = () => {
        setObjSelectedTx(null);
        setIsFormOpen(true);
    };

    const handleEdit = (objRow: ITransactionDisplay) => {
        setObjSelectedTx(objRow);
        setIsFormOpen(true);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* 1. Toolbar */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    size="small"
                    placeholder="ค้นหารายการ, tags…"
                    value={sSearch}
                    onChange={(e) => setSSearch(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
                        }
                    }}
                    sx={{ flexGrow: 1, minWidth: 250, bgcolor: 'background.paper', borderRadius: 1 }}
                />
                <Select size="small" defaultValue="all" sx={{ minWidth: 140, bgcolor: 'background.paper' }}>
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                </Select>
                <Select size="small" defaultValue="all" sx={{ minWidth: 140, bgcolor: 'background.paper' }}>
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                </Select>
                <Button variant="outlined" color="inherit" startIcon={<CalendarMonthIcon />} sx={{ borderColor: 'divider', color: 'text.secondary' }}>Date Range</Button>
                <Button variant="outlined" color="inherit" startIcon={<DownloadIcon />} sx={{ borderColor: 'divider', color: 'text.secondary' }}>Export CSV</Button>
                <Button variant="contained" color="primary" onClick={handleAddNew}>＋ Add</Button>
            </Box>

            {/* 2. Stats Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                {[
                    { label: 'Total Transactions', value: lstTransactions.length.toString(), sub: 'All records', color: 'text.primary', valColor: 'text.primary' },
                    { label: 'Total Income', value: `+฿${objStats.nTotalIncome.toLocaleString()}`, sub: 'All time', color: 'success.main', valColor: 'primary.main' },
                    { label: 'Total Expenses', value: `-฿${objStats.nTotalExpense.toLocaleString()}`, sub: 'All time', color: 'error.main', valColor: 'error.main' },
                    { label: 'Net Cash Flow', value: `${objStats.nNet >= 0 ? '+' : ''}฿${objStats.nNet.toLocaleString()}`, sub: 'All time', color: 'success.main', valColor: 'secondary.main' }
                ].map((stat, idx) => (
                    <Paper key={idx} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                        <Typography sx={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 500, color: stat.valColor, mt: 0.5 }}>
                            {stat.value}
                        </Typography>
                        <Typography variant="caption" sx={{ color: stat.color, mt: 0.5, display: 'block' }}>
                            {stat.sub}
                        </Typography>
                    </Paper>
                ))}
            </Box>

            {/* 3. Table Card */}
            <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle1" sx={{ fontFamily: 'Syne', fontWeight: 700 }}>All Transactions</Typography>
                    <Chip label={`${lstTransactions.length} records`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary', fontSize: 12 }} />
                </Box>

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <LogoLoader />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table size="small" sx={{ '& .MuiTableCell-root': { py: 1.5, borderColor: 'divider' } }}>
                            <TableHead sx={{ bgcolor: 'background.default' }}>
                                <TableRow>
                                    <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Description ↕</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Category</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Tags</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Date ↓</TableCell>
                                    <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600 }}>Amount ↕</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lstTransactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 5, color: 'text.secondary' }}>ไม่พบข้อมูลธุรกรรม</TableCell>
                                    </TableRow>
                                ) : (
                                    lstTransactions.map((objRow) => (
                                        <TableRow
                                            key={objRow.nId}
                                            hover
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() => handleEdit(objRow)}
                                        >
                                            <TableCell padding="checkbox"><Checkbox size="small" onClick={(e) => e.stopPropagation()} /></TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                                                    {objRow.sTitleMain}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={objRow.sCategory}
                                                    size="small"
                                                    sx={{ bgcolor: objRow.sCatBg, color: objRow.sCatColor, fontSize: 11, fontWeight: 600, height: 22 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={objRow.sTagName}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        color: objRow.sTagColor,
                                                        borderColor: `${objRow.sTagColor}40`,
                                                        bgcolor: `${objRow.sTagColor}15`,
                                                        fontSize: 10, height: 20
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' }}>
                                                {objRow.dDate}
                                            </TableCell>
                                            <TableCell align="right" sx={{
                                                fontFamily: 'monospace',
                                                fontWeight: 600,
                                                color: objRow.isIncome ? 'primary.main' : 'error.main'
                                            }}>
                                                {objRow.sAmount}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={<CircleIcon sx={{ fontSize: 8, color: objRow.sStatusColor }} />}
                                                    label={objRow.sStatus}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'transparent',
                                                        border: `1px solid ${objRow.sStatusColor}40`,
                                                        color: objRow.sStatusColor,
                                                        fontSize: 11, fontWeight: 600, height: 22
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton size="small" sx={{ color: 'text.secondary' }}><MoreHorizIcon fontSize="small" /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">Showing {lstTransactions.length} records</Typography>
                    <Pagination count={1} page={1} shape="rounded" size="small" color="primary" />
                </Box>
            </Paper>

            <TransactionFormDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSaved={fetchTransactions}
                objEditData={objSelectedTx ? objSelectedTx._raw : null}
            />

        </Box>
    );
};