// =====================================================
// API SERVICE - Centralized Axios instance
// All API calls go through this file
// =====================================================
import axios from 'axios';

/**
 * Determine the correct API base URL:
 *  - Local dev  : uses '/api' → Vite proxy forwards to http://localhost:5000/api
 *  - Production : VITE_API_URL may be 'https://backend.com' or 'https://backend.com/api'
 *                 We always ensure it ends with '/api' so routes resolve correctly.
 */
function getBaseURL() {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api'; // local dev — use Vite proxy
  // Strip trailing slash, then add /api if not already present
  const clean = envUrl.replace(/\/$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
}

const api = axios.create({
  baseURL: getBaseURL(),
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
