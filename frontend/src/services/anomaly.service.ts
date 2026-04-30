import { apiClient } from './apiClient';
import { IAnomaly, IApiResponse } from '@/interfaces';

export const anomalyService = {
    getActive: async (): Promise<IApiResponse<IAnomaly[]>> => {
        return apiClient<IApiResponse<IAnomaly[]>>('/Anomalies');
    },
    markAsReviewed: async (nId: number): Promise<IApiResponse<void>> => {
        return apiClient<IApiResponse<void>>(`/Anomalies/${nId}/review`, {
            method: 'POST'
        });
    }
};
