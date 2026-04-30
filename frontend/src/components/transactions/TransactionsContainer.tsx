'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Typography, Button, TextField, Select, MenuItem, InputAdornment,
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Checkbox, Chip, IconButton, Pagination,
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SyncIcon from '@mui/icons-material/Sync';
import dayjs from 'dayjs';
import { TransactionFormDialog } from './TransactionFormDialog';
import { LogoLoader } from '../common/LogoLoader';
import { ITransaction, ITag, IApiResponse } from '@/interfaces';
import { transactionService } from '@/services/transaction.service';
import { tagService } from '@/services/tag.service';
import { TransactionStatus } from '@/enum';
import { useNotification } from '@/hooks/useNotification';
import { exportToCSV } from '@/utils/exportCsv';

interface ITransactionDisplay {
    nTransactionsId: number;
    sTitleMain: string;
    sCategory: string;
    sCatColor: string;
    sCatBg: string;
    sTagName: string;
    sTagColor: string;
    sDate: string;
    sAmount: string;
    isIncome: boolean;
    sStatus: string;
    sStatusColor: string;
    sRecurringRuleName: string | null;
    _raw: ITransaction;
}

export const TransactionsContainer = () => {
    const [sSearch, setSSearch] = useState('');
    const [lstTransactions, setLstTransactions] = useState<ITransactionDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sTypeFilter, setSTypeFilter] = useState('all');
    const [sStatusFilter, setSStatusFilter] = useState('all');
    const [sTagFilter, setSTagFilter] = useState('all');
    const [sStartDate, setSStartDate] = useState('');
    const [sEndDate, setSEndDate] = useState('');
    const [lstSelectedIds, setLstSelectedIds] = useState<number[]>([]);
    const [lstTags, setLstTags] = useState<ITag[]>([]);

    // Pagination & Sorting State
    const [nPage, setNPage] = useState(1);
    const nRowsPerPage = 10;
    const [sSortField, setSSortField] = useState<keyof ITransactionDisplay | 'nAmount'>('sDate');
    const [sSortOrder, setSSortOrder] = useState<'asc' | 'desc'>('desc');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [objSelectedTx, setObjSelectedTx] = useState<ITransactionDisplay | null>(null);

    const { notify, NotificationComponent } = useNotification();

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        try {
            const objResult = await transactionService.getAll() as IApiResponse<ITransaction[]>;

            if (objResult.status === 'success') {
                const lstRawData = objResult.data || [];
                const lstMapped: ITransactionDisplay[] = lstRawData.map((item: ITransaction) => {
                    const isIncome = item.sType?.toUpperCase() === 'INCOME';
                    return {
                        nTransactionsId: item.nTransactionsId,
                        sTitleMain: item.sDescription,
                        sCategory: item.sCategoryName || "General",
                        sCatColor: isIncome ? "#00e5a0" : "#ff4d6d",
                        sCatBg: isIncome ? "rgba(0, 229, 160, 0.1)" : "rgba(255, 77, 109, 0.1)",
                        sTagName: item.sTagName || "Untagged",
                        sTagColor: item.sTagColor || "#7a8499",
                        sDate: dayjs(item.dDate).format('YYYY-MM-DD'),
                        sAmount: `${isIncome ? '+' : '-'}฿${item.nAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                        isIncome: isIncome,
                        sStatus: item.sStatus || "Confirmed",
                        sStatusColor: item.sStatus === "Completed" || item.sStatus === "Confirmed" ? "#00e5a0" : "#ffcc00",
                        _raw: item,
                        sRecurringRuleName: item.sRecurringRuleName || null,
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
        
        // Fetch Tags for search dropdown
        const fetchTags = async () => {
            try {
                const tagRes = await tagService.getAll() as IApiResponse<ITag[]>;
                if (tagRes.status === 'success') setLstTags(tagRes.data || []);
            } catch (objError) {
                console.error('Failed to fetch tags for filter', objError);
            }
        };
        fetchTags();
    }, [fetchTransactions]);
    
    // Get unique tags by name for the filter dropdown
    const lstUniqueTags = useMemo(() => {
        const lstUnique: ITag[] = [];
        const setNames = new Set<string>();
        
        // Only show active tags in the filter dropdown (Support 0/1, "0"/"1", and true/false)
        const lstFiltered = lstTags.filter(t => Number(t.isActive) === 1 || t.isActive === true);

        lstFiltered.forEach(t => {
            if (t.sName && !setNames.has(t.sName.trim().toLowerCase())) {
                setNames.add(t.sName.trim().toLowerCase());
                lstUnique.push(t);
            }
        });
        return lstUnique;
    }, [lstTags]);

    // 1. Filtering Logic
    const lstFilteredTransactions = useMemo(() => {
        return lstTransactions.filter(obj => {
            const matchesSearch = !sSearch ||
                obj.sTitleMain.toLowerCase().includes(sSearch.toLowerCase()) ||
                obj.sTagName.toLowerCase().includes(sSearch.toLowerCase()) ||
                obj.sCategory.toLowerCase().includes(sSearch.toLowerCase());

            const matchesType = sTypeFilter === 'all' || (sTypeFilter === 'income' ? obj.isIncome : !obj.isIncome);
            
            // Status Filter (Case-sensitive matching with Enum)
            const matchesStatus = sStatusFilter === 'all' || obj.sStatus === sStatusFilter;

            // Tag Filter
            const matchesTag = sTagFilter === 'all' || obj.sTagName === sTagFilter;

            let isMatchesDate = true;
            if (sStartDate) isMatchesDate = isMatchesDate && dayjs(obj.sDate).isAfter(dayjs(sStartDate).subtract(1, 'day'));
            if (sEndDate) isMatchesDate = isMatchesDate && dayjs(obj.sDate).isBefore(dayjs(sEndDate).add(1, 'day'));

            return matchesSearch && matchesType && matchesStatus && matchesTag && isMatchesDate;
        });
    }, [lstTransactions, sSearch, sTypeFilter, sStatusFilter, sTagFilter, sStartDate, sEndDate]);

    // 2. Sorting Logic
    const lstSortedTransactions = useMemo(() => {
        const lstSorted = [...lstFilteredTransactions];
        lstSorted.sort((a, b) => {
            let valA: string | number, valB: string | number;
            if (sSortField === 'sDate') {
                valA = dayjs(a.sDate).unix();
                valB = dayjs(b.sDate).unix();
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
        const headers = ["ID", "Description", "Category", "Tag", "Date", "Amount", "Status"];
        const rows = lstFilteredTransactions.map(t => [
            t.nTransactionsId,
            t.sTitleMain,
            t.sCategory,
            t.sTagName,
            t.sDate,
            t._raw.nAmount,
            t.sStatus
        ]);
        exportToCSV(`Transactions_${dayjs().format('YYYYMMDD')}.csv`, headers, rows);
    };

    const handleDelete = async (nTransactionsId?: number) => {
        const idsToDelete = nTransactionsId ? [nTransactionsId] : lstSelectedIds;
        if (idsToDelete.length === 0) return;
        if (!confirm(`ยืนยันการลบข้อมูล ${idsToDelete.length} รายการ?`)) return;

        setIsLoading(true);
        try {
            await transactionService.bulkDelete(idsToDelete);
            setLstSelectedIds([]);
            setNPage(1);
            notify(`ลบข้อมูล ${idsToDelete.length} รายการสำเร็จ`);
            await fetchTransactions();
        } catch (objError: unknown) {
            console.error('Operation failed', objError);
            notify('เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 1. Toolbar */}
            <Grid container spacing={1.5} sx={{ alignItems: 'center', width: '100%' }}>
                <Grid size={{ xs: 12, md: 'grow' }}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="ค้นหา..."
                        value={sSearch}
                        onChange={(e) => { setSSearch(e.target.value); setNPage(1); }}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
                        sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                    />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 'auto' }}>
                        <TextField
                            size="small"
                            type="date"
                            label="Start"
                            value={sStartDate}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSStartDate(val);
                                setNPage(1);
                                if (sEndDate && val && dayjs(val).isAfter(dayjs(sEndDate))) {
                                    setSEndDate(val);
                                }
                            }}
                            slotProps={{
                                inputLabel: { shrink: true },
                                htmlInput: { max: sEndDate || undefined }
                            }}
                            sx={{
                                width: 130, bgcolor: 'background.paper', input: { color: '#fff' },
                                '& input::-webkit-calendar-picker-indicator': {
                                    filter: 'invert(1)',
                                    cursor: 'pointer'
                                }
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 'auto' }}>
                        <TextField
                            size="small"
                            type="date"
                            label="End"
                            value={sEndDate}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSEndDate(val);
                                setNPage(1);
                                if (sStartDate && val && dayjs(val).isBefore(dayjs(sStartDate))) {
                                    setSStartDate(val);
                                }
                            }}
                            slotProps={{
                                inputLabel: { shrink: true },
                                htmlInput: { min: sStartDate || undefined }
                            }}
                            sx={{
                                width: 130, bgcolor: 'background.paper', input: { color: '#fff' },
                                '& input::-webkit-calendar-picker-indicator': {
                                    filter: 'invert(1)',
                                    cursor: 'pointer'
                                }
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 'auto' }}>
                        <Select size="small" fullWidth value={sTypeFilter} onChange={e => { setSTypeFilter(e.target.value as string); setNPage(1); }} sx={{ minWidth: 100, bgcolor: 'background.paper' }}>
                            <MenuItem value="all">All Types</MenuItem>
                            <MenuItem value="income">Income</MenuItem>
                            <MenuItem value="expense">Expense</MenuItem>
                        </Select>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 'auto' }}>
                        <Select size="small" fullWidth value={sStatusFilter} onChange={e => { setSStatusFilter(e.target.value as string); setNPage(1); }} sx={{ minWidth: 100, bgcolor: 'background.paper' }}>
                            <MenuItem value="all">All Status</MenuItem>
                            {Object.values(TransactionStatus).map(status => (
                                <MenuItem key={status} value={status}>{status}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 'auto' }}>
                        <Select
                            size="small"
                            fullWidth
                            value={lstUniqueTags.some(t => t.sName === sTagFilter) || sTagFilter === 'all' ? sTagFilter : 'all'}
                            onChange={e => { setSTagFilter(e.target.value as string); setNPage(1); }}
                            sx={{ minWidth: 100, bgcolor: 'background.paper' }}
                        >
                            <MenuItem value="all">All Tags</MenuItem>
                            {lstUniqueTags.map(tag => (
                                <MenuItem key={tag.nTagsId} value={tag.sName}>{tag.sName}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 'auto' }}>
                        <Button variant="outlined" fullWidth color="inherit" startIcon={<DownloadIcon />} onClick={handleExportCSV} sx={{ borderColor: 'divider', color: 'text.secondary' }}>Export</Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 'auto' }}>
                        <Button variant="contained" fullWidth color="primary" onClick={handleAddNew}>＋ Add</Button>
                    </Grid>
                </Grid>

            {/* 2. Stats Row */}
            <Grid container spacing={2}>
                {[
                    { label: 'Transactions', value: lstFilteredTransactions.length.toString(), sub: 'Matched records', valColor: 'text.primary' },
                    { label: 'Filtered Income', value: `+฿${objFilteredStats.nTotalIncome.toLocaleString()}`, sub: 'Current view', valColor: 'primary.main' },
                    { label: 'Filtered Expenses', value: `-฿${objFilteredStats.nTotalExpense.toLocaleString()}`, sub: 'Current view', valColor: 'error.main' },
                    { label: 'Filtered Net', value: `${objFilteredStats.nNet >= 0 ? '+' : ''}฿${objFilteredStats.nNet.toLocaleString()}`, sub: 'Current view', valColor: 'secondary.main' }
                ].map((stat, idx) => (
                    <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                            <Typography sx={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 500, color: stat.valColor, mt: 0.5 }}>{stat.value}</Typography>
                            <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: 'text.secondary' }}>{stat.sub}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

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
                                        onClick={() => handleSort('sDate')}
                                    >
                                        Date {sSortField === 'sDate' ? (sSortOrder === 'asc' ? <ArrowUpwardIcon sx={{ fontSize: 14 }} /> : <ArrowDownwardIcon sx={{ fontSize: 14 }} />) : null}
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
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                                                            {objRow.sTitleMain}
                                                        </Typography>
                                                        {objRow.sRecurringRuleName && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                                                                <SyncIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 10 }}>
                                                                    {objRow.sRecurringRuleName}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell><Chip label={objRow.sCategory} size="small" sx={{ bgcolor: objRow.sCatBg, color: objRow.sCatColor, fontSize: 11, fontWeight: 600, height: 22 }} /></TableCell>
                                                <TableCell><Chip label={objRow.sTagName} size="small" variant="outlined" sx={{ color: objRow.sTagColor, borderColor: `${objRow.sTagColor}40`, bgcolor: `${objRow.sTagColor}15`, fontSize: 10, height: 20 }} /></TableCell>
                                                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' }}>{objRow.sDate}</TableCell>
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
            <TransactionFormDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSaved={() => {
                    notify(objSelectedTx ? 'อัปเดตข้อมูลสำเร็จ' : 'เพิ่มข้อมูลสำเร็จ');
                    fetchTransactions();
                }}
                objEditData={objSelectedTx ? objSelectedTx._raw : null}
            />

            {NotificationComponent}
        </Box>
    );
};