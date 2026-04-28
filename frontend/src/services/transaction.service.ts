import { apiClient } from './apiClient';
import { ITransactionForm, ICategory } from '@/interfaces';

export const transactionService = {
    getAll: async () => {
        return apiClient('/Transactions');
    },

    getCategories: async () => {
        return apiClient('/Transactions/categories');
    },
    getRecurringRules: async () => {
        return apiClient('/Transactions/recurring-rules');
    },

    saveCategory: async (data: ICategory) => {
        return apiClient('/Transactions/categories', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    save: async (data: ITransactionForm) => {
        // Sanitize numeric fields to ensure no nulls are sent to backend ints
        const sanitizedData = {
            ...data,
            nAmount: data.nAmount || 0,
            nTagId: data.nTagId || 0,
            nCategoryId: data.nCategoryId || 0
        };
        return apiClient('/Transactions', {
            method: 'POST',
            body: JSON.stringify(sanitizedData),
        });
    },

    delete: async (id: number) => {
        return apiClient(`/Transactions/${id}`, {
            method: 'DELETE',
        });
    },

    bulkDelete: async (ids: number[]) => {
        // Fix Bug: Use Promise.allSettled to ensure all deletions attempt to run,
        // and speed up the process by running them concurrently instead of sequentially.
        const results = await Promise.allSettled(
            ids.map(id => apiClient(`/Transactions/${id}`, { method: 'DELETE' }))
        );
        
        const failed = results.filter(r => r.status === 'rejected');
        if (failed.length > 0) {
            console.error('Some deletions failed', failed);
            throw new Error('บางรายการไม่สามารถลบได้');
        }
        return { status: 'success' };
    }
};
