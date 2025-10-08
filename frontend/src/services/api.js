import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7211/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
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