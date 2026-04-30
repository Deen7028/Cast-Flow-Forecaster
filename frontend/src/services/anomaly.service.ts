import { apiClient } from './apiClient';

export interface AnomalyTag {
  label: string;
}

export interface AnomalyAlert {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  date: string;
  transactionId?: number;
  tags: AnomalyTag[];
}

export interface DetectionRule {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
}

export const anomalyService = {
  getAlerts: async (): Promise<AnomalyAlert[]> => {
    return apiClient<AnomalyAlert[]>('/anomalies/alerts', { method: 'GET' });
  },
  
  getRules: async (): Promise<DetectionRule[]> => {
    return apiClient<DetectionRule[]>('/anomalies/rules', { method: 'GET' });
  },

  toggleRule: async (id: string, isActive: boolean): Promise<void> => {
    return apiClient<void>(`/anomalies/rules/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isActive })
    });
  },

  markAsReviewed: async (id: string): Promise<void> => {
    return apiClient<void>(`/anomalies/alerts/${id}/review`, {
      method: 'POST'
    });
  },

  triggerDetection: async (): Promise<void> => {
    return apiClient<void>('/anomalies/detect', {
      method: 'POST'
    });
  }
};
