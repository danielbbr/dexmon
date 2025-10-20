// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (password) => api.post('/login', { password }),
  logout: () => {
    localStorage.removeItem('token');
  },
  isAuthenticated: () => !!localStorage.getItem('token')
};

export const devices = {
  getAll: () => api.get('/devices'),
  update: (mac, name, icon) => api.post('/devices/update', { mac, name, icon })
};

export default api;