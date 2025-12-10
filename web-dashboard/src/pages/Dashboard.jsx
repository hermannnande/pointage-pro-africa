import { useEffect, useState } from 'react'
import { HiUsers, HiClock, HiExclamation, HiCheckCircle } from 'react-icons/hi'
import StatCard from '../components/StatCard'
import AttendanceChart from '../components/AttendanceChart'
import RecentAttendances from '../components/RecentAttendances'
import { getDashboardStats, getWeeklyStats } from '../services/api'
import { mockStats, mockWeekStats } from '../services/mockData'

const DEMO_MODE = true

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [weekStats, setWeekStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      if (DEMO_MODE) {
        // Mode démo - utiliser les données mockées
        await new Promise(resolve => setTimeout(resolve, 500))
        setStats(mockStats)
        setWeekStats(mockWeekStats)
      } else {
        // Mode production - appeler l'API
        const [statsRes, weekRes] = await Promise.all([
          getDashboardStats(),
          getWeeklyStats(),
        ])
        
        setStats(statsRes.data)
        setWeekStats(weekRes.data)
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
      // Fallback sur les données de démo
      setStats(mockStats)
      setWeekStats(mockWeekStats)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Vue d'ensemble de l'activité</p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Présents"
          value={stats?.present_count?.toString() || '0'}
          change={`${stats?.present_percentage || 0}%`}
          changeType="positive"
          icon={HiCheckCircle}
          color="green"
        />
        <StatCard
          title="En retard"
          value={stats?.late_count?.toString() || '0'}
          change={stats?.late_count > 10 ? 'Élevé' : 'Normal'}
          changeType={stats?.late_count > 10 ? 'negative' : 'neutral'}
          icon={HiClock}
          color="yellow"
        />
        <StatCard
          title="Absents"
          value={stats?.absent_count?.toString() || '0'}
          change={stats?.absent_count > 5 ? '+' + stats?.absent_count : 'Normal'}
          changeType="neutral"
          icon={HiExclamation}
          color="red"
        />
        <StatCard
          title="Total employés"
          value={stats?.total_employees?.toString() || '0'}
          change="Actifs"
          changeType="positive"
          icon={HiUsers}
          color="blue"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart data={weekStats} />
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Alertes et notifications
          </h3>
          <div className="space-y-4">
            <AlertItem
              type="warning"
              title="5 retards > 30 minutes"
              time="Aujourd'hui"
            />
            <AlertItem
              type="error"
              title="3 absences non justifiées"
              time="Aujourd'hui"
            />
            <AlertItem
              type="info"
              title="12 demandes de congés en attente"
              time="Cette semaine"
            />
            <AlertItem
              type="success"
              title="Taux de présence: 94%"
              time="Ce mois"
            />
          </div>
        </div>
      </div>
      
      {/* Recent attendances */}
      <RecentAttendances />
    </div>
  )
}

function AlertItem({ type, title, time }) {
  const colors = {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  }
  
  return (
    <div className={`p-4 rounded-lg border ${colors[type]}`}>
      <div className="flex items-center justify-between">
        <p className="font-medium">{title}</p>
        <p className="text-sm opacity-75">{time}</p>
      </div>
    </div>
  )
}

