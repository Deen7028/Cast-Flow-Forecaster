import React, { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import { RecurringRule } from '@/interfaces/Irecurring';
import { apiClient } from '@/services/apiClient';

export const useRecurringRules = () => {
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

    const fetchRules = useCallback(async () => {
        try {
            setLoading(true);
            const data = await apiClient<RecurringRule[]>('/Recurring');
            setRules(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRules();
    }, [fetchRules]);

    const filteredRules = rules.filter(r => {
        const statusMatch = sStatusFilter === 'all' || (sStatusFilter === 'active' ? r.isActive : !r.isActive);
        const typeMatch = sTypeFilter === 'all' || r.categoryType?.toLowerCase() === sTypeFilter;
        return statusMatch && typeMatch;
    });

    useEffect(() => {
        setNPage(1);
    }, [sStatusFilter, sTypeFilter]);

    const formatAmount = useCallback((amount: number) => {
        return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
    }, []);

    const calculateMonthlyEquivalent = useCallback((rule: RecurringRule) => {
        if (!rule.isActive) return 0;
        const freq = rule.sFrequency.toLowerCase();
        let monthlyAmount = rule.nAmount;
        if (freq === 'daily') monthlyAmount = rule.nAmount * 30;
        else if (freq === 'weekly') monthlyAmount = rule.nAmount * 4.33;
        else if (freq === 'yearly') monthlyAmount = rule.nAmount / 12;

        return rule.categoryType?.toLowerCase() === 'income' ? monthlyAmount : -monthlyAmount;
    }, []);

    const getEffectiveNextRun = useCallback((rule: RecurringRule) => {
        if (!rule.isActive || !rule.dNextRunDate) return null;
        return dayjs(rule.dNextRunDate);
    }, []);

    const formatDate = useCallback((rule: RecurringRule) => {
        const start = new Date(rule.dStartDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        let desc = `${rule.sFrequency.toUpperCase()}`;
        if (rule.nDayOfMonth) desc += ` • Day ${rule.nDayOfMonth}`;
        desc += ` | Started: ${start}`;
        return desc;
    }, []);

    const handleSave = useCallback(async (payload: any) => {
        try {
            await apiClient('/Recurring', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            fetchRules();
            setFormOpen(false);
        } catch (err: any) {
            alert('Error saving rule: ' + err.message);
        }
    }, [fetchRules]);

    const handleEdit = useCallback((rule: RecurringRule) => {
        setEditingRule(rule);
        setFormOpen(true);
    }, []);

    const handleAddNew = useCallback(() => {
        setEditingRule(null);
        setFormOpen(true);
    }, []);

    const handleDelete = useCallback(async (id: number) => {
        if (!confirm('ยืนยันการลบกฎการทำซ้ำนี้? ข้อมูลประวัติการทำรายการจะยังคงอยู่')) return;
        try {
            await apiClient(`/Recurring/${id}`, {
                method: 'DELETE',
            });
            fetchRules();
        } catch (err) {
            console.error('Delete failed', err);
        }
    }, [fetchRules]);

    const handleToggleActive = useCallback(async (rule: RecurringRule) => {
        try {
            await apiClient('/Recurring/bulk-status', {
                method: 'POST',
                body: JSON.stringify({ ids: [rule.nRecurringRulesId], isActive: !rule.isActive }),
            });
            fetchRules();
        } catch (err) {
            console.error('Toggle failed', err);
        }
    }, [fetchRules]);

    const handleViewHistory = useCallback(async (e: React.MouseEvent | null, rule: RecurringRule) => {
        if (e) e.stopPropagation();
        setSelectedRuleName(rule.sName);
        try {
            const data = await apiClient<any[]>(`/Recurring/${rule.nRecurringRulesId}/history`);
            setHistoryData(data);
            setHistoryOpen(true);
        } catch (err) {
            console.error('Fetch history failed', err);
        }
    }, []);

    const handleBulkStatus = useCallback(async (isActive: boolean) => {
        if (selectedIds.length === 0) return;
        try {
            await apiClient('/Recurring/bulk-status', {
                method: 'POST',
                body: JSON.stringify({ ids: selectedIds, isActive }),
            });
            fetchRules();
            setSelectedIds([]);
        } catch (err) {
            console.error('Bulk update failed', err);
        }
    }, [selectedIds, fetchRules]);

    const handleBulkDelete = useCallback(async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`ยืนยันการลบ ${selectedIds.length} รายการที่เลือก?`)) return;
        try {
            await apiClient('/Recurring/bulk-delete', {
                method: 'POST',
                body: JSON.stringify(selectedIds),
            });
            fetchRules();
            setSelectedIds([]);
        } catch (err) {
            console.error('Bulk delete failed', err);
        }
    }, [selectedIds, fetchRules]);

    const handleSelectAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedIds(filteredRules.map(r => r.nRecurringRulesId));
        } else {
            setSelectedIds([]);
        }
    }, [filteredRules]);

    const handleSelectRow = useCallback((id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    }, []);

    const nPageSize = 5;
    const nTotalPages = Math.ceil(filteredRules.length / nPageSize);
    const lstPagedRules = filteredRules.slice((nPage - 1) * nPageSize, nPage * nPageSize);

    return {
        rules,
        loading,
        error,
        nPage,
        setNPage,
        sStatusFilter,
        setSStatusFilter,
        sTypeFilter,
        setSTypeFilter,
        selectedIds,
        setSelectedIds,
        formOpen,
        setFormOpen,
        editingRule,
        setEditingRule,
        historyOpen,
        setHistoryOpen,
        historyData,
        selectedRuleName,
        filteredRules,
        fetchRules,
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
        nTotalPages,
        lstPagedRules,
    };
};
