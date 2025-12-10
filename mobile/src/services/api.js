import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL de l'API (à configurer)
const API_URL = 'http://localhost:5000/api';

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
  async (config) => {
    const token = await AsyncStorage.getItem('token');
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
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // Navigation vers login (à implémenter avec navigation)
    }
    return Promise.reject(error);
  }
);

// API d'authentification
export const authAPI = {
  login: (identifier, password) =>
    api.post('/auth/login', { identifier, password }),
  
  register: (userData) =>
    api.post('/auth/register', userData),
  
  getProfile: () =>
    api.get('/auth/me'),
  
  updateProfile: (data) =>
    api.put('/auth/profile', data),
  
  changePassword: (currentPassword, newPassword) =>
    api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    }),
  
  registerDeviceToken: (deviceToken, platform) =>
    api.post('/auth/device-token', { device_token: deviceToken, platform }),
};

// API de pointage
export const attendanceAPI = {
  clockIn: (data) =>
    api.post('/attendances/clock-in', data),
  
  clockOut: (data) =>
    api.post('/attendances/clock-out', data),
  
  syncAttendances: (attendances) =>
    api.post('/attendances/sync', { attendances }),
  
  getMyAttendances: (startDate, endDate, limit) =>
    api.get('/attendances/my-attendances', {
      params: { start_date: startDate, end_date: endDate, limit },
    }),
  
  getTeamAttendances: (date, siteId) =>
    api.get('/attendances/team', {
      params: { date, site_id: siteId },
    }),
  
  correctAttendance: (id, data) =>
    api.put(`/attendances/${id}/correct`, data),
};

// API de congés
export const leaveAPI = {
  createLeave: (data) =>
    api.post('/leaves', data),
  
  getMyLeaves: (status, year) =>
    api.get('/leaves/my-leaves', {
      params: { status, year },
    }),
  
  getTeamLeaves: (status) =>
    api.get('/leaves/team', {
      params: { status },
    }),
  
  reviewLeave: (id, status, rejectionReason) =>
    api.put(`/leaves/${id}/review`, {
      status,
      rejection_reason: rejectionReason,
    }),
  
  cancelLeave: (id) =>
    api.delete(`/leaves/${id}`),
};

// Upload de fichiers (selfie, documents)
export const uploadFile = async (uri, fieldName = 'file') => {
  const formData = new FormData();
  
  formData.append(fieldName, {
    uri,
    type: 'image/jpeg',
    name: `${fieldName}_${Date.now()}.jpg`,
  });

  const token = await AsyncStorage.getItem('token');
  
  return fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};

export default api;

