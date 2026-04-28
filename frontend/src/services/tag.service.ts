import { apiClient } from './apiClient';
import { ITag } from '@/interfaces';

export const tagService = {
    getAll: async () => {
        return apiClient('/Tags');
    },

    save: async (data: ITag) => {
        return apiClient('/Tags', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
};
