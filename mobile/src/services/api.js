import axios from 'axios';
import { API_URL, TIMEOUT, ENABLE_LOGS } from '@env';

/**
 * API Service for Chat Sentiment Application
 * Handles all HTTP requests to the .NET backend
 * Features: Request/Response logging, Error handling, Timeout management
 * 
 * Environment Variables (from .env):
 * - API_URL: Backend API base URL
 * - TIMEOUT: Request timeout in milliseconds
 * - ENABLE_LOGS: Enable/disable console logging
 */

// Fallback values if .env not loaded
const API_BASE_URL = API_URL || 'http://10.0.2.2:7211/api';
const REQUEST_TIMEOUT = parseInt(TIMEOUT) || 10000;
const LOGS_ENABLED = ENABLE_LOGS === 'true';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: REQUEST_TIMEOUT,
});

// Request interceptor - Log all outgoing requests
api.interceptors.request.use(
    (config) => {
        if (LOGS_ENABLED) {
            console.log(`🚀 [API] ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    (error) => {
        console.error('❌ [API] Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => {
        if (LOGS_ENABLED) {
            console.log(`✅ [API] ${response.status} ${response.config.url}`);
        }
        return response;
    },
    (error) => {
        if (LOGS_ENABLED) {
            console.error('❌ [API] Response Error:', error.response?.status, error.message);
        }
        
        // Handle specific error cases
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout. Please check your connection.');
        }
        
        if (error.response?.status === 500) {
            throw new Error('Server error. Please try again later.');
        }
        
        if (!error.response) {
            throw new Error('Network error. Please check your internet connection.');
        }
        
        return Promise.reject(error);
    }
);

// Users API
export const registerUser = async (nickname) => {
    const response = await api.post('/users/register', { nickname });
    return response.data;
};

export const getUser = async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
};

// Messages API
export const sendMessage = async (userId, content) => {
    const response = await api.post('/messages', { userId, content });
    return response.data;
};

export const getMessages = async (userId = null, limit = 50) => {
    const params = {};
    if (userId) params.userId = userId;
    if (limit) params.limit = limit;

    const response = await api.get('/messages', { params });
    return response.data;
};

export const getMessageStats = async (userId = null) => {
    const params = {};
    if (userId) params.userId = userId;

    const response = await api.get('/messages/stats', { params });
    return response.data;
};

export default api;