"use client";

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Stack, Tab, Tabs, Grid, CircularProgress,
  Checkbox, MenuItem, Select, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, Chip, TextField, IconButton
} from '@mui/material';
import { Add, MoreHoriz as MoreHorizIcon, History as HistoryIcon } from '@mui/icons-material';
import dayjs from 'dayjs';

import RuleCard from '@/components/Recurring/RecurRuleCard';
import RecurRuleForm from '@/components/Recurring/RecurRuleForm';
import { RecurringRule } from '@/interfaces/Irecurring';

export default function RecurringPage() {
  const [rules, setRules] = useState<RecurringRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [nPage, setNPage] = useState(1);
  const [sStatusFilter, setSStatusFilter] = useState('all');
  const [sTypeFilter, setSTypeFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RecurringRule | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [selectedRuleName, setSelectedRuleName] = useState('');

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5221/api'}/Recurring`);
      if (!response.ok) {
        throw new Error('Failed to fetch recurring rules');
      }
      const data = await response.json();
      setRules(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredRules = rules.filter(r => {
    const statusMatch = sStatusFilter === 'all' || (sStatusFilter === 'active' ? r.isActive : !r.isActive);
    const typeMatch = sTypeFilter === 'all' || r.categoryType?.toLowerCase() === sTypeFilter;
    return statusMatch && typeMatch;
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  };

  const calculateMonthlyEquivalent = (rule: RecurringRule) => {
    if (!rule.isActive) return 0;
    const freq = rule.sFrequency.toLowerCase();
    let monthlyAmount = rule.nAmount;
    if (freq === 'daily') monthlyAmount = rule.nAmount * 30;
    else if (freq === 'weekly') monthlyAmount = rule.nAmount * 4.33;
    else if (freq === 'yearly') monthlyAmount = rule.nAmount / 12;

    return rule.categoryType?.toLowerCase() === 'income' ? monthlyAmount : -monthlyAmount;
  };



  const getEffectiveNextRun = (rule: RecurringRule) => {
    if (!rule.isActive || !rule.dNextRunDate) return null;
    return dayjs(rule.dNextRunDate);
  };

  const formatDate = (rule: RecurringRule) => {
    const start = new Date(rule.dStartDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    let desc = `${rule.sFrequency.toUpperCase()}`;
    if (rule.nDayOfMonth) desc += ` • Day ${rule.nDayOfMonth}`;
    desc += ` | Started: ${start}`;
    return desc;
  };


  const handleSave = async (payload: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5221/api'}/Recurring`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchRules();
        setFormOpen(false);
      } else {
        const err = await response.text();
        alert('Error saving rule: ' + err);
      }
    } catch (err: any) {
      alert('Network error: ' + err.message);
    }
  };

  const handleEdit = (rule: RecurringRule) => {
    setEditingRule(rule);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingRule(null);
    setFormOpen(true);
  };


  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันการลบกฎการทำซ้ำนี้? ข้อมูลประวัติการทำรายการจะยังคงอยู่')) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5221/api'}/Recurring/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) fetchRules();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleToggleActive = async (rule: RecurringRule) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5221/api'}/Recurring/bulk-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [rule.nRecurringRulesId], isActive: !rule.isActive }),
      });
      if (response.ok) fetchRules();
    } catch (err) {
      console.error('Toggle failed', err);
    }
  };


  const handleViewHistory = async (e: React.MouseEvent | null, rule: RecurringRule) => {
    if (e) e.stopPropagation();
    setSelectedRuleName(rule.sName);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5221/api'}/Recurring/${rule.nRecurringRulesId}/history`);
      if (response.ok) {
        const data = await response.json();
        setHistoryData(data);
        setHistoryOpen(true);
      }
    } catch (err) {
      console.error('Fetch history failed', err);
    }
  };

  const handleBulkStatus = async (isActive: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5221/api'}/Recurring/bulk-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, isActive }),
      });
      if (response.ok) {
        fetchRules();
        setSelectedIds([]);
      }
    } catch (err) {
      console.error('Bulk update failed', err);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`ยืนยันการลบ ${selectedIds.length} รายการที่เลือก?`)) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5221/api'}/Recurring/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedIds),
      });
      if (response.ok) {
        fetchRules();
        setSelectedIds([]);
      }
    } catch (err) {
      console.error('Bulk delete failed', err);
    }
  };


  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(filteredRules.map(r => r.nRecurringRulesId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {[
          {
            label: 'EST. MONTHLY CASH FLOW',
            value: formatAmount(rules.reduce((sum, r) => sum + calculateMonthlyEquivalent(r), 0)),
            sub: 'Total active rules',
            valColor: rules.reduce((sum, r) => sum + calculateMonthlyEquivalent(r), 0) >= 0 ? '#10b981' : '#ef4444'
          },
          {
            label: 'ACTIVE RULES',
            value: rules.filter(r => r.isActive).length.toString(),
            sub: 'Currently running',
            valColor: 'primary.main'
          },
          {
            label: 'NEXT GENERATION',
            value: rules.some(r => getEffectiveNextRun(r))
              ? rules
                .map(r => getEffectiveNextRun(r))
                .filter(d => d !== null)
                .sort((a, b) => a!.diff(b!))[0]
                ?.format('MMM D')
              : '-',
            sub: 'Earliest upcoming',
            valColor: 'secondary.main'
          }
        ].map((stat, idx) => (
          <Paper key={idx} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
            <Typography sx={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 500, color: stat.valColor, mt: 0.5 }}>{stat.value}</Typography>
            <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: 'text.secondary' }}>{stat.sub}</Typography>
          </Paper>
        ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,

        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <Checkbox
            checked={filteredRules.length > 0 && selectedIds.length === filteredRules.length}
            indeterminate={selectedIds.length > 0 && selectedIds.length < filteredRules.length}
            onChange={handleSelectAll}
            sx={{ color: 'divider', '&.Mui-checked': { color: 'primary.main' } }}
          />
          <Tabs value={0} sx={{
            bgcolor: 'background.paper', borderRadius: 2, p: 0.5,
            border: '1px solid', borderColor: 'divider',
            '& .MuiTabs-indicator': { display: 'none' },
            '& .Mui-selected': { bgcolor: 'action.selected', borderRadius: 1.5, color: 'text.primary !important' }
          }}>
            <Tab label="All Rules" sx={{ color: 'text.secondary', textTransform: 'none', minWidth: 80 }} />
          </Tabs>
          <Select size="small" value={sStatusFilter} onChange={e => { setSStatusFilter(e.target.value as string); setNPage(1); }} sx={{ minWidth: 120, bgcolor: 'background.paper' }}>
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
          {selectedIds.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" sx={{ color: 'primary.main', borderColor: 'primary.main' }} onClick={() => handleBulkStatus(true)}>Activate</Button>
              <Button size="small" variant="outlined" sx={{ color: 'warning.main', borderColor: 'warning.main' }} onClick={() => handleBulkStatus(false)}>Deactivate</Button>
              <Button size="small" variant="outlined" sx={{ color: 'error.main', borderColor: 'error.main' }} onClick={handleBulkDelete}>Delete</Button>
            </Box>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          sx={{ bgcolor: 'primary.main', color: 'background.default', fontWeight: 'bold', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          New Rule
        </Button>
      </Box>

      <Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography sx={{ color: '#f8fafc', textAlign: "center" }} >{error}</Typography>
        ) : filteredRules.length === 0 ? (
          <Typography sx={{ color: 'text.secondary', textAlign: "center" }} >No recurring rules found matching filters.</Typography>
        ) : (
          filteredRules
            .sort((a, b) => {
              const dateA = getEffectiveNextRun(a);
              const dateB = getEffectiveNextRun(b);
              if (!dateA) return 1;
              if (!dateB) return -1;
              return dateA.diff(dateB);
            })
            .map((rule) => (
              <RuleCard
                key={rule.nRecurringRulesId}
                title={rule.sName}
                status={rule.isActive ? 'Active' : 'Inactive'}
                isActive={rule.isActive ?? true}
                isSelected={selectedIds.includes(rule.nRecurringRulesId)}
                onSelect={() => handleSelectRow(rule.nRecurringRulesId)}
                amount={formatAmount(rule.nAmount)}
                type={rule.categoryName || 'Unknown'}
                categoryType={rule.categoryType}
                frequency={rule.sFrequency}
                date={formatDate(rule)}
                nextRunDate={getEffectiveNextRun(rule)?.format('MMM D, YYYY')}
                color={rule.isActive ? 'primary.main' : 'text.secondary'}
                onEdit={() => handleEdit(rule)}
                onDelete={() => handleDelete(rule.nRecurringRulesId)}
                onToggleActive={() => handleToggleActive(rule)}
                onViewHistory={() => handleViewHistory(null as any, rule)}
              />
            ))
        )}

      </Box>

      <RecurRuleForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initialData={editingRule}
      />

      {/* History Dialog */}
      <Dialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { bgcolor: 'background.paper', color: 'text.primary', borderRadius: 3, border: '1px solid', borderColor: 'divider' }
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Syne', fontWeight: 700 }}>
            Transaction History: {selectedRuleName}
          </Typography>
          <TableContainer component={Paper} sx={{ bgcolor: 'transparent', backgroundImage: 'none', boxShadow: 'none', border: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', borderColor: 'divider' }}>Date</TableCell>
                  <TableCell sx={{ color: 'text.secondary', borderColor: 'divider' }}>Description</TableCell>
                  <TableCell sx={{ color: 'text.secondary', borderColor: 'divider' }}>Type</TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary', borderColor: 'divider' }}>Amount</TableCell>
                  <TableCell sx={{ color: 'text.secondary', borderColor: 'divider' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary', borderColor: 'divider' }}>
                      No transactions generated yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  historyData.map((tx) => (
                    <TableRow key={tx.nTransactionsId}>
                      <TableCell sx={{ color: 'text.primary', borderColor: 'divider', fontFamily: 'monospace' }}>
                        {dayjs(tx.dTransactionDate).format('YYYY-MM-DD')}
                      </TableCell>
                      <TableCell sx={{ color: 'text.primary', borderColor: 'divider' }}>{tx.sDescription}</TableCell>
                      <TableCell sx={{ color: 'text.primary', borderColor: 'divider' }}>
                        <Typography variant="caption" sx={{ color: tx.sType?.toLowerCase() === 'income' ? 'primary.main' : 'text.secondary' }}>
                          {tx.sType}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{
                        color: tx.sType?.toLowerCase() === 'income' ? 'primary.main' : 'text.primary',
                        borderColor: 'divider',
                        fontFamily: 'monospace',
                        fontWeight: 600
                      }}>
                        {tx.sType?.toLowerCase() === 'income' ? '+' : '-'} ฿{tx.nAmount.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ borderColor: 'divider' }}>
                        <Chip
                          label={tx.sStatus}
                          size="small"
                          sx={{
                            bgcolor: tx.sStatus?.toLowerCase() === 'success' || tx.sStatus?.toLowerCase() === 'completed'
                              ? 'primary.light'
                              : tx.sStatus?.toLowerCase() === 'pending'
                                ? 'warning.light'
                                : 'error.light',
                            color: tx.sStatus?.toLowerCase() === 'success' || tx.sStatus?.toLowerCase() === 'completed'
                              ? 'primary.main'
                              : tx.sStatus?.toLowerCase() === 'pending'
                                ? 'warning.main'
                                : 'error.main',
                            fontSize: 10,
                            fontWeight: 600,
                            border: '1px solid',
                            borderColor: 'transparent'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setHistoryOpen(false)} sx={{ color: 'text.secondary' }}>Close</Button>
          </Box>
        </Box>
      </Dialog>

    </Box>
  );
}
