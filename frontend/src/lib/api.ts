/**
 * API Client Library
 * Type-safe API functions for frontend integration
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://abhi02072005-llmworkflow.hf.space';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add any auth tokens here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// ============================================================
// DASHBOARD API
// ============================================================

export const dashboardApi = {
    getStats: () => apiClient.get('/api/dashboard/stats'),
    getActivity: () => apiClient.get('/api/dashboard/activity'),
    getUsage: () => apiClient.get('/api/dashboard/usage'),
};

// ============================================================
// TOKENIZER API
// ============================================================

export const tokenizerApi = {
    tokenize: (text: string) =>
        apiClient.post('/api/tokenizer/tokenize', { text }),
};

// ============================================================
// COST ANALYSIS API
// ============================================================

export const costApi = {
    analyze: (data: {
        prompt: string;
        system_prompt?: string;
        complexity: number;
        priority: 'quality' | 'speed' | 'cost';
    }) => apiClient.post('/api/cost/analyze', data),

    getModels: () => apiClient.get('/api/cost/models'),
};

// ============================================================
// ANALYTICS API
// ============================================================

export const analyticsApi = {
    getMonthlyReport: (year?: number, month?: number) => {
        const now = new Date();
        const currentYear = year || now.getFullYear();
        const currentMonth = month || (now.getMonth() + 1); // JavaScript months are 0-indexed
        return apiClient.get(`/api/analytics/monthly-report?year=${currentYear}&month=${currentMonth}`);
    },

    getCostTrend: (days: number = 30) =>
        apiClient.get(`/api/analytics/cost-trend?days=${days}`),

    getQualityTrend: (days: number = 30) =>
        apiClient.get(`/api/analytics/quality-trend?days=${days}`),

    getBloatTrend: (days: number = 30) =>
        apiClient.get(`/api/analytics/bloat-trend?days=${days}`),
};

// ============================================================
// SECURITY API
// ============================================================

export const securityApi = {
    analyze: (data: { prompt: string; system_prompt?: string }) =>
        apiClient.post('/api/security/analyze', data),
};

// ============================================================
// EMBEDDINGS API
// ============================================================

export const embeddingsApi = {
    generate: (texts: string[]) =>
        apiClient.post('/api/embeddings/generate', { texts }),
};

// ============================================================
// ATTENTION API
// ============================================================

export const attentionApi = {
    analyze: (data: { text: string; layer?: number; head?: number }) =>
        apiClient.post('/api/attention/analyze', data),
};

// ============================================================
// CONTEXT WINDOW API
// ============================================================

export const contextApi = {
    getRecallCurve: (maxTokens: number = 16000) =>
        apiClient.get(`/api/context/recall-curve?max_tokens=${maxTokens}`),
};

// Export default client
export default apiClient;
