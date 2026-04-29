import { IApiResponse } from "@/interfaces";

export const apiClient = async <T = IApiResponse>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        
        const responseText = await response.text();
        let objData: T = {} as T;
        try {
            objData = (responseText ? JSON.parse(responseText) : {}) as T;
        } catch {
            console.error('Failed to parse JSON response', responseText);
        }

        if (!response.ok) {
            console.error('API Error Response:', responseText);
            const sErrorMsg = (objData as unknown as { message?: string })?.message || `API request failed with status ${response.status}`;
            throw new Error(sErrorMsg);
        }

        return objData;
    } catch (error) {
        console.error('API Client Error:', error);
        throw error;
    }
};
