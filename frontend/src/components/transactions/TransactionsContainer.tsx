'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Typography, Button, TextField, Select, MenuItem, InputAdornment,
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Checkbox, Chip, IconButton, Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import dayjs from 'dayjs';
import { TransactionFormDialog } from './TransactionFormDialog';
import { LogoLoader } from '../common/LogoLoader';
import { ITransaction } from '@/interfaces';

interface ITransactionDisplay {
    nTransactionsId: number;
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
    const [sTypeFilter, setSTypeFilter] = useState('all');
    const [sStatusFilter, setSStatusFilter] = useState('all');
    const [dStartDate, setDStartDate] = useState('');
    const [dEndDate, setDEndDate] = useState('');
    const [lstSelectedIds, setLstSelectedIds] = useState<number[]>([]);

    // Pagination & Sorting State
    const [nPage, setNPage] = useState(1);
    const nRowsPerPage = 10;
    const [sSortField, setSSortField] = useState<keyof ITransactionDisplay | 'nAmount'>('dDate');
    const [sSortOrder, setSSortOrder] = useState<'asc' | 'desc'>('desc');

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
                const lstMapped: ITransactionDisplay[] = lstRawData.map((item: ITransaction) => {
                    const sTypeUpper = item.sType ? item.sType.toUpperCase() : '';
                    const isIncome = sTypeUpper === 'INCOME';
                    return {
                        nTransactionsId: item.nTransactionsId,
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
                setLstSelectedIds([]);
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

    // 1. Filtering Logic
    const lstFilteredTransactions = useMemo(() => {
        return lstTransactions.filter(obj => {
            const matchesSearch = !sSearch ||
                obj.sTitleMain.toLowerCase().includes(sSearch.toLowerCase()) ||
                obj.sTagName.toLowerCase().includes(sSearch.toLowerCase()) ||
                obj.sCategory.toLowerCase().includes(sSearch.toLowerCase());

            const matchesType = sTypeFilter === 'all' || (sTypeFilter === 'income' ? obj.isIncome : !obj.isIncome);
            const matchesStatus = sStatusFilter === 'all' || obj.sStatus.toLowerCase() === sStatusFilter.toLowerCase();

            let matchesDate = true;
            if (dStartDate) matchesDate = matchesDate && dayjs(obj.dDate).isAfter(dayjs(dStartDate).subtract(1, 'day'));
            if (dEndDate) matchesDate = matchesDate && dayjs(obj.dDate).isBefore(dayjs(dEndDate).add(1, 'day'));

            return matchesSearch && matchesType && matchesStatus && matchesDate;
        });
    }, [lstTransactions, sSearch, sTypeFilter, sStatusFilter, dStartDate, dEndDate]);

    // 2. Sorting Logic
    const lstSortedTransactions = useMemo(() => {
        const lstSorted = [...lstFilteredTransactions];
        lstSorted.sort((a, b) => {
            let valA: string | number, valB: string | number;
            if (sSortField === 'dDate') {
                valA = dayjs(a.dDate).unix();
                valB = dayjs(b.dDate).unix();
            } else if (sSortField === 'nAmount') {
                valA = a._raw.nAmount;
                valB = b._raw.nAmount;
            } else {
                // ฟิลด์ทั่วไปที่เป็น string หรือ number ใน ITransactionDisplay
                const key = sSortField as keyof ITransactionDisplay;
                const rawValA = a[key];
                const rawValB = b[key];
                valA = (typeof rawValA === 'string' || typeof rawValA === 'number') ? rawValA : '';
                valB = (typeof rawValB === 'string' || typeof rawValB === 'number') ? rawValB : '';
            }

            if (valA < valB) return sSortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sSortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        return lstSorted;
    }, [lstFilteredTransactions, sSortField, sSortOrder]);

    // 3. Stats for Filtered Data
    const objFilteredStats = useMemo(() => {
        let nIncome = 0; let nExpense = 0;
        lstFilteredTransactions.forEach(tx => {
            if (tx.isIncome) nIncome += tx._raw.nAmount;
            else nExpense += tx._raw.nAmount;
        });
        return { nTotalIncome: nIncome, nTotalExpense: nExpense, nNet: nIncome - nExpense };
    }, [lstFilteredTransactions]);

    // 4. Pagination Logic
    const nTotalPages = Math.ceil(lstSortedTransactions.length / nRowsPerPage);
    const lstPagedTransactions = useMemo(() => {
        const nStartIndex = (nPage - 1) * nRowsPerPage;
        return lstSortedTransactions.slice(nStartIndex, nStartIndex + nRowsPerPage);
    }, [lstSortedTransactions, nPage]);

    const handleSort = (sField: keyof ITransactionDisplay | 'nAmount') => {
        if (sSortField === sField) {
            setSSortOrder(sSortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSSortField(sField);
            setSSortOrder('desc');
        }
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setLstSelectedIds(lstFilteredTransactions.map(n => n.nTransactionsId));
        } else {
            setLstSelectedIds([]);
        }
    };

    const handleRowCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>, nTransactionsId: number) => {
        event.stopPropagation();
        const nSelectedIndex = lstSelectedIds.indexOf(nTransactionsId);
        let lstNewSelected: number[] = [];
        if (nSelectedIndex === -1) lstNewSelected = [...lstSelectedIds, nTransactionsId];
        else lstNewSelected = lstSelectedIds.filter(id => id !== nTransactionsId);
        setLstSelectedIds(lstNewSelected);
    };

    const handleAddNew = () => {
        setObjSelectedTx(null);
        setIsFormOpen(true);
    };

    const handleEdit = (objRow: ITransactionDisplay) => {
        setObjSelectedTx(objRow);
        setIsFormOpen(true);
    };

    const handleExportCSV = () => {
        if (lstFilteredTransactions.length === 0) return;
        const sHeaders = "ID,Description,Category,Tag,Date,Amount,Status\n";
        const sRows = lstFilteredTransactions.map(t =>
            `${t.nTransactionsId},"${t.sTitleMain}",${t.sCategory},${t.sTagName},${t.dDate},${t._raw.nAmount},${t.sStatus}`
        ).join("\n");
        const blob = new Blob(['\ufeff' + sHeaders + sRows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Transactions_${dayjs().format('YYYYMMDD')}.csv`;
        link.click();
    };

    const handleDelete = async (nTransactionsId?: number) => {
        const idsToDelete = nTransactionsId ? [nTransactionsId] : lstSelectedIds;
        if (idsToDelete.length === 0) return;
        if (!confirm(`ยืนยันการลบข้อมูล ${idsToDelete.length} รายการ?`)) return;

        setIsLoading(true);
        try {
            for (const id of idsToDelete) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Transactions/${id}`, { method: 'DELETE' });
            }
            setLstSelectedIds([]);
            setNPage(1);
            await fetchTransactions();
        } catch (error) {
            console.error('Delete failed', error);
            alert('ลบข้อมูลไม่สำเร็จ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 1. Toolbar */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    size="small"
                    placeholder="ค้นหา..."
                    value={sSearch}
                    onChange={(e) => { setSSearch(e.target.value); setNPage(1); }}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
                    sx={{ flexGrow: 1, minWidth: 200, bgcolor: 'background.paper', borderRadius: 1 }}
                />
                <TextField size="small" type="date" label="Start" value={dStartDate} onChange={(e) => { setDStartDate(e.target.value); setNPage(1); }} slotProps={{ inputLabel: { shrink: true } }} sx={{
                    width: 130, bgcolor: 'background.paper', input: { color: '#fff' },
                    '& input::-webkit-calendar-picker-indicator': {
                        filter: 'invert(1)',
                            cursor: 'pointer'
                    }
                }} />
                <TextField size="small" type="date" label="End" value={dEndDate} onChange={(e) => { setDEndDate(e.target.value); setNPage(1); }} slotProps={{ inputLabel: { shrink: true } }} sx={{
                    width: 130, bgcolor: 'background.paper', input: { color: '#fff' },
                    '& input::-webkit-calendar-picker-indicator': {
                        filter: 'invert(1)',
                        cursor: 'pointer'
                    }
                }} />
                <Select size="small" value={sTypeFilter} onChange={e => { setSTypeFilter(e.target.value as string); setNPage(1); }} sx={{ minWidth: 120, bgcolor: 'background.paper' }}>
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                </Select>
                <Select size="small" value={sStatusFilter} onChange={e => { setSStatusFilter(e.target.value as string); setNPage(1); }} sx={{ minWidth: 120, bgcolor: 'background.paper' }}>
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                </Select>
                <Button variant="outlined" color="inherit" startIcon={<DownloadIcon />} onClick={handleExportCSV} sx={{ borderColor: 'divider', color: 'text.secondary' }}>Export</Button>
                <Button variant="contained" color="primary" onClick={handleAddNew}>＋ Add</Button>
            </Box>

            {/* 2. Stats Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                {[
                    { label: 'Transactions', value: lstFilteredTransactions.length.toString(), sub: 'Matched records', valColor: 'text.primary' },
                    { label: 'Filtered Income', value: `+฿${objFilteredStats.nTotalIncome.toLocaleString()}`, sub: 'Current view', valColor: 'primary.main' },
                    { label: 'Filtered Expenses', value: `-฿${objFilteredStats.nTotalExpense.toLocaleString()}`, sub: 'Current view', valColor: 'error.main' },
                    { label: 'Filtered Net', value: `${objFilteredStats.nNet >= 0 ? '+' : ''}฿${objFilteredStats.nNet.toLocaleString()}`, sub: 'Current view', valColor: 'secondary.main' }
                ].map((stat, idx) => (
                    <Paper key={idx} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                        <Typography sx={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 500, color: stat.valColor, mt: 0.5 }}>{stat.value}</Typography>
                        <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: 'text.secondary' }}>{stat.sub}</Typography>
                    </Paper>
                ))}
            </Box>

            {/* 3. Table Card */}
            <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle1" sx={{ fontFamily: 'Syne', fontWeight: 700 }}>Transactions</Typography>
                    <Chip label={`${lstFilteredTransactions.length} records`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary', fontSize: 12 }} />
                    {lstSelectedIds.length > 0 && (
                        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" color="primary.main">{lstSelectedIds.length} selected</Typography>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleDelete()} sx={{ borderRadius: 1.5 }}>Delete</Button>
                        </Box>
                    )}
                </Box>

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><LogoLoader /></Box>
                ) : (
                    <TableContainer>
                        <Table size="small" sx={{ '& .MuiTableCell-root': { py: 1.5, borderColor: 'divider' } }}>
                            <TableHead sx={{ bgcolor: 'background.default' }}>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            size="small"
                                            indeterminate={lstSelectedIds.length > 0 && lstSelectedIds.length < lstFilteredTransactions.length}
                                            checked={lstFilteredTransactions.length > 0 && lstSelectedIds.length === lstFilteredTransactions.length}
                                            onChange={handleSelectAllClick}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Description</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Category</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Tags</TableCell>
                                    <TableCell
                                        sx={{ color: 'text.secondary', fontWeight: 600, cursor: 'pointer' }}
                                        onClick={() => handleSort('dDate')}
                                    >
                                        Date {sSortField === 'dDate' ? (sSortOrder === 'asc' ? <ArrowUpwardIcon sx={{ fontSize: 14 }} /> : <ArrowDownwardIcon sx={{ fontSize: 14 }} />) : null}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ color: 'text.secondary', fontWeight: 600, cursor: 'pointer' }}
                                        onClick={() => handleSort('nAmount')}
                                    >
                                        Amount {sSortField === 'nAmount' ? (sSortOrder === 'asc' ? <ArrowUpwardIcon sx={{ fontSize: 14 }} /> : <ArrowDownwardIcon sx={{ fontSize: 14 }} />) : null}
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lstPagedTransactions.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} align="center" sx={{ py: 5, color: 'text.secondary' }}>ไม่พบข้อมูล</TableCell></TableRow>
                                ) : (
                                    lstPagedTransactions.map((objRow) => {
                                        const isItemSelected = lstSelectedIds.indexOf(objRow.nTransactionsId) !== -1;
                                        return (
                                            <TableRow key={objRow.nTransactionsId} hover selected={isItemSelected} sx={{ cursor: 'pointer' }} onClick={() => handleEdit(objRow)}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox size="small" checked={isItemSelected} onChange={(e) => handleRowCheckboxClick(e, objRow.nTransactionsId)} onClick={(e) => e.stopPropagation()} />
                                                </TableCell>
                                                <TableCell><Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>{objRow.sTitleMain}</Typography></TableCell>
                                                <TableCell><Chip label={objRow.sCategory} size="small" sx={{ bgcolor: objRow.sCatBg, color: objRow.sCatColor, fontSize: 11, fontWeight: 600, height: 22 }} /></TableCell>
                                                <TableCell><Chip label={objRow.sTagName} size="small" variant="outlined" sx={{ color: objRow.sTagColor, borderColor: `${objRow.sTagColor}40`, bgcolor: `${objRow.sTagColor}15`, fontSize: 10, height: 20 }} /></TableCell>
                                                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' }}>{objRow.dDate}</TableCell>
                                                <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 600, color: objRow.isIncome ? 'primary.main' : 'error.main' }}>{objRow.sAmount}</TableCell>
                                                <TableCell><Chip icon={<CircleIcon sx={{ fontSize: 8, color: objRow.sStatusColor }} />} label={objRow.sStatus} size="small" sx={{ bgcolor: 'transparent', border: `1px solid ${objRow.sStatusColor}40`, color: objRow.sStatusColor, fontSize: 11, fontWeight: 600, height: 22 }} /></TableCell>
                                                <TableCell align="center"><IconButton size="small" sx={{ color: 'text.secondary' }} onClick={(e) => { e.stopPropagation(); handleDelete(objRow.nTransactionsId); }}><MoreHorizIcon fontSize="small" /></IconButton></TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">Showing {lstPagedTransactions.length} of {lstFilteredTransactions.length} records</Typography>
                    <Pagination
                        count={nTotalPages}
                        page={nPage}
                        onChange={(_, val) => setNPage(val)}
                        shape="rounded" size="small" color="primary"
                    />
                </Box>
            </Paper>
            <TransactionFormDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSaved={fetchTransactions} objEditData={objSelectedTx ? objSelectedTx._raw : null} />
        </Box>
    );
};