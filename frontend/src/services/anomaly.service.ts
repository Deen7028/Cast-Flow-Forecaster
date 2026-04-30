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
  suggestedAmount?: number;
  suggestedCategoryId?: number;
  recurringRuleId?: number;
  tags: AnomalyTag[];
}

export interface DetectionRule {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  threshold?: number;
  fixedCostAlertDay?: number;
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
  
  updateRuleParameters: async (id: string, parameters: { threshold?: number }): Promise<void> => {
    return apiClient<void>(`/anomalies/rules/${id}/parameters`, {
      method: 'PUT',
      body: JSON.stringify(parameters)
    });
  },

  markAsReviewed: async (id: string): Promise<void> => {
    return apiClient<void>(`/anomalies/alerts/${id}/review`, {
      method: 'POST'
    });
  },

  triggerDetection: async (force: boolean = false): Promise<void> => {
    return apiClient<void>(`/anomalies/detect${force ? '?force=true' : ''}`, {
      method: 'POST'
    });
  }
};
