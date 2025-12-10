import { useEffect, useState } from 'react'
import { HiPlus, HiDownload, HiUpload } from 'react-icons/hi'
import { getUsers } from '../services/api'
import toast from 'react-hot-toast'
import { mockEmployees } from '../services/mockData'

const DEMO_MODE = true

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    site_id: '',
    is_active: '1',
  })
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  })

  useEffect(() => {
    loadEmployees()
  }, [filters])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      
      if (DEMO_MODE) {
        // Mode démo
        await new Promise(resolve => setTimeout(resolve, 500))
        
        let filtered = [...mockEmployees]
        
        // Filtre de recherche
        if (filters.search) {
          filtered = filtered.filter(emp =>
            emp.first_name.toLowerCase().includes(filters.search.toLowerCase()) ||
            emp.last_name.toLowerCase().includes(filters.search.toLowerCase()) ||
            emp.employee_code.toLowerCase().includes(filters.search.toLowerCase())
          )
        }
        
        setEmployees(filtered)
        setPagination({
          current_page: 1,
          last_page: 1,
          total: filtered.length,
        })
      } else {
        // Mode production
        const response = await getUsers(filters)
        setEmployees(response.data.data)
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
        })
      }
    } catch (error) {
      console.error('Error loading employees:', error)
      toast.error('Erreur de chargement des employés')
      // Fallback sur données démo
      setEmployees(mockEmployees)
      setPagination({ current_page: 1, last_page: 1, total: mockEmployees.length })
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employés</h1>
          <p className="text-gray-600">Gestion des employés ({pagination.total} total)</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <HiDownload className="w-4 h-4" />
            <span>Exporter</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <HiUpload className="w-4 h-4" />
            <span>Importer</span>
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2">
            <HiPlus className="w-4 h-4" />
            <span>Nouvel employé</span>
          </button>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Rechercher un employé..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Tous les sites</option>
            <option>Bingerville</option>
            <option>Yopougon</option>
            <option>Cocody</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Tous les services</option>
            <option>Commercial</option>
            <option>Logistique</option>
            <option>Production</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Statut: Tous</option>
            <option>Actifs</option>
            <option>Inactifs</option>
          </select>
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Employé</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Poste</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Site</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Téléphone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-sm">
                          {employee.first_name?.[0]}{employee.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {employee.first_name} {employee.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{employee.email || '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.employee_code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.position || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.site?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      employee.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {employee.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Affichage de {(pagination.current_page - 1) * 30 + 1} à {Math.min(pagination.current_page * 30, pagination.total)} sur {pagination.total} employés
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              Précédent
            </button>
            <button className="px-3 py-1 bg-primary-600 text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

