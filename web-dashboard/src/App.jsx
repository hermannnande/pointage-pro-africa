import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Attendances from './pages/Attendances'
import Leaves from './pages/Leaves'
import Sites from './pages/Sites'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import useAuthStore from './stores/authStore'

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore()
  
  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendances" element={<Attendances />} />
          <Route path="leaves" element={<Leaves />} />
          <Route path="sites" element={<Sites />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

