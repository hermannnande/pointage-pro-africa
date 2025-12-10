import { create } from 'zustand'
import { login as apiLogin, logout as apiLogout, getMe } from '../services/api'
import { mockUser } from '../services/mockData'

const DEMO_MODE = true // MODE DEMO pour tester sans backend

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    
    // MODE DEMO
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (email === 'admin@demo-ci.com' && password === 'password') {
        const token = 'demo_token_12345'
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(mockUser))
        
        set({
          user: mockUser,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
        return true
      } else {
        set({
          error: 'Identifiants incorrects. Utilisez: admin@demo-ci.com / password',
          isLoading: false,
        })
        return false
      }
    }
    
    // MODE PRODUCTION
    try {
      const response = await apiLogin(email, password)
      const { user, access_token } = response.data
      
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      
      set({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
      })
      
      return true
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Erreur de connexion',
        isLoading: false,
      })
      return false
    }
  },

  logout: async () => {
    try {
      await apiLogout()
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        set({
          user,
          token,
          isAuthenticated: true,
        })
        
        // Vérifier le token avec l'API
        await getMe()
      } catch (error) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      }
    }
  },
}))

export default useAuthStore

