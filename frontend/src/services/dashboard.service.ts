import { apiClient } from './apiClient';
import { IDashboardMetrics, IApiResponse } from '@/interfaces';

export const dashboardService = {
    getMetrics: async (): Promise<IApiResponse<IDashboardMetrics>> => {
        return apiClient<IApiResponse<IDashboardMetrics>>('/Dashboard/metrics');
    }
};
