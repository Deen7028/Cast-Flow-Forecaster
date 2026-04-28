import { useState, useEffect } from 'react';
import { RecurringRule } from '@/interfaces/Irecurring';
import dayjs from 'dayjs';

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

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5221/api';

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/Recurring`);
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
      const response = await fetch(`${apiUrl}/Recurring`, {
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
      const response = await fetch(`${apiUrl}/Recurring/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) fetchRules();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleToggleActive = async (rule: RecurringRule) => {
    try {
      const response = await fetch(`${apiUrl}/Recurring/bulk-status`, {
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
      const response = await fetch(`${apiUrl}/Recurring/${rule.nRecurringRulesId}/history`);
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
      const response = await fetch(`${apiUrl}/Recurring/bulk-status`, {
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
      const response = await fetch(`${apiUrl}/Recurring/bulk-delete`, {
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
  };
};
