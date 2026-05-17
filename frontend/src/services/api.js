// =====================================================
// API SERVICE - Centralized Axios instance
// All API calls go through this file
// =====================================================
import axios from 'axios';

const api = axios.create({
  // In dev, use relative '/api' so the Vite proxy forwards to backend (avoids CORS).
  // In production, set VITE_API_URL to your deployed backend URL.
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Automatically attach JWT token to protected requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
