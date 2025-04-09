// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Automatically attach token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ❗ Optional: Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You could log out the user on 401, show toast, etc.
    if (error.response?.status === 401) {
      console.warn('Unauthorized — logging out');
      localStorage.removeItem('token');
      // Optionally redirect: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
