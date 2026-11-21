import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillmate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global 401 & Error Formatter
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('skillmate_token');
        localStorage.removeItem('skillmate_user');
        window.location.href = '/login?session_expired=true';
      }
    }

    const message = error.response?.data?.message || error.message || 'Network error. Please check backend connection.';
    const errors = error.response?.data?.errors || null;

    return Promise.reject({
      message,
      errors,
      status: error.response?.status
    });
  }
);

export default api;
