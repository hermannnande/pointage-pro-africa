import { NavLink } from 'react-router-dom'
import { 
  HiHome, 
  HiUsers, 
  HiClock, 
  HiCalendar, 
  HiOfficeBuilding,
  HiChartBar,
  HiCog,
} from 'react-icons/hi'

const navItems = [
  { to: '/', icon: HiHome, label: 'Dashboard' },
  { to: '/employees', icon: HiUsers, label: 'Employés' },
  { to: '/attendances', icon: HiClock, label: 'Pointages' },
  { to: '/leaves', icon: HiCalendar, label: 'Congés' },
  { to: '/sites', icon: HiOfficeBuilding, label: 'Sites' },
  { to: '/reports', icon: HiChartBar, label: 'Rapports' },
  { to: '/settings', icon: HiCog, label: 'Paramètres' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <HiClock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Pointage Pro</h1>
            <p className="text-xs text-gray-500">Africa</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* User info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-semibold">AD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">admin@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

