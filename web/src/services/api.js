import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Créer une instance axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.error || error.message || 'Une erreur est survenue';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

// API d'authentification
export const authAPI = {
  login: (identifier, password) =>
    api.post('/auth/login', { identifier, password }),
  
  getProfile: () =>
    api.get('/auth/me'),
};

// API des employés
export const employeesAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// API des pointages
export const attendancesAPI = {
  getAll: (params) => api.get('/attendances/team', { params }),
  getMyAttendances: (params) => api.get('/attendances/my-attendances', { params }),
  correct: (id, data) => api.put(`/attendances/${id}/correct`, data),
};

// API des congés
export const leavesAPI = {
  getAll: (params) => api.get('/leaves/team', { params }),
  review: (id, status, rejectionReason) =>
    api.put(`/leaves/${id}/review`, { status, rejection_reason: rejectionReason }),
};

export default api;

