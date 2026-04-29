"use client";

import React from 'react';
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

import { useRecurringRules } from '@/hooks/useRecurringRules';

export default function RecurringPage() {
  const {
    rules,
    loading,
    error,
    nPage,
    setNPage,
    formOpen,
    setFormOpen,
    editingRule,
    setEditingRule,
    historyOpen,
    setHistoryOpen,
    historyData,
    selectedRuleName,
    filteredRules,
    formatAmount,
    calculateMonthlyEquivalent,
    getEffectiveNextRun,
    formatDate,
    handleSave,
    handleEdit,
    handleAddNew,
    handleDelete,
    handleToggleActive,
    handleViewHistory,
    handleBulkStatus,
    handleBulkDelete,
    handleSelectAll,
    handleSelectRow,
    selectedIds,
    setSelectedIds,
    sStatusFilter,
    setSStatusFilter,
    sTypeFilter,
    setSTypeFilter,
    fetchRules,
  } = useRecurringRules();

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
          <Select size="small" value={sStatusFilter} onChange={e => { setSStatusFilter(e.target.value as string); }} sx={{ minWidth: 120, bgcolor: 'background.paper' }}>
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
