import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/dashboard';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) => 
    api.post('/auth/register', { name, email, password }),
  
  getProfile: () => api.get('/auth/me'),
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }
};

export const apiKeys = {
  list: () => api.get('/api-keys'),
  create: (name: string) => api.post('/api-keys', { name }),
  update: (id: string, data: any) => api.patch(`/api-keys/${id}`, data),
  delete: (id: string) => api.delete(`/api-keys/${id}`),
  getUsage: (id: string, days?: number) => 
    api.get(`/api-keys/${id}/usage?days=${days || 7}`),
};

export const usage = {
  getStats: (days?: number) => 
    api.get(`/usage/stats?days=${days || 30}`),
  getRecent: (limit?: number) => 
    api.get(`/usage/recent?limit=${limit || 50}`),
  getRateLimits: () => api.get('/usage/rate-limits'),
};

export default { auth, apiKeys, usage };
