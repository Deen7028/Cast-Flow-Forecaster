import { apiClient } from './apiClient';
import { LoginFormData } from '@/validations/auth.schema';

export const authService = {
    login: async (data: LoginFormData) => {
        return apiClient('/Auth/login', {
            method: 'POST',
            body: JSON.stringify({
                Username: data.Username,
                Password: data.Password,
            }),
        });
    }
};
