import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré, déconnecter
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ===== AUTHENTIFICATION =====

export const login = (email, password) => {
  return api.post('/auth/login', { login: email, password })
}

export const getMe = () => {
  return api.get('/auth/me')
}

export const logout = () => {
  return api.post('/auth/logout')
}

// ===== DASHBOARD =====

export const getDashboardStats = (params = {}) => {
  return api.get('/dashboard/stats', { params })
}

export const getDashboardAttendances = (params = {}) => {
  return api.get('/dashboard/attendances', { params })
}

export const getLateEmployees = (params = {}) => {
  return api.get('/dashboard/late-employees', { params })
}

export const getAbsentEmployees = (params = {}) => {
  return api.get('/dashboard/absent-employees', { params })
}

export const getPendingRequests = () => {
  return api.get('/dashboard/pending-requests')
}

export const getWeeklyStats = () => {
  return api.get('/dashboard/weekly-stats')
}

export const getMonthlyStats = (params = {}) => {
  return api.get('/dashboard/monthly-stats', { params })
}

// ===== EMPLOYÉS =====

export const getUsers = (params = {}) => {
  return api.get('/admin/users', { params })
}

export const createUser = (data) => {
  return api.post('/admin/users', data)
}

export const updateUser = (id, data) => {
  return api.put(`/admin/users/${id}`, data)
}

export const deleteUser = (id) => {
  return api.delete(`/admin/users/${id}`)
}

// ===== POINTAGES =====

export const getAttendanceHistory = (params = {}) => {
  return api.get('/attendance/history', { params })
}

// ===== CONGÉS =====

export const getLeaveRequests = (params = {}) => {
  return api.get('/leave-requests', { params })
}

export const createLeaveRequest = (data) => {
  return api.post('/leave-requests', data)
}

export const approveLeaveRequest = (id, comment) => {
  return api.post(`/leave-requests/${id}/approve`, { comment })
}

export const rejectLeaveRequest = (id, comment) => {
  return api.post(`/leave-requests/${id}/reject`, { comment })
}

export const getLeaveTypes = () => {
  return api.get('/leave-types')
}

export default api

