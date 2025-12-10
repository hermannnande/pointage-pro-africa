export default function RecentAttendances() {
  const attendances = [
    { id: 1, name: 'Kouassi Ama', code: '001', clockIn: '08:05', clockOut: '17:10', status: 'late' },
    { id: 2, name: 'Yao Marie', code: '002', clockIn: '07:55', clockOut: '17:00', status: 'present' },
    { id: 3, name: 'Bamba Koné', code: '003', clockIn: '--:--', clockOut: '--:--', status: 'absent' },
    { id: 4, name: 'Traoré Salif', code: '004', clockIn: '08:00', clockOut: '17:05', status: 'present' },
    { id: 5, name: 'Koné Fanta', code: '005', clockIn: '08:15', clockOut: '17:00', status: 'late' },
  ]
  
  const statusConfig = {
    present: { label: 'Présent', color: 'bg-green-100 text-green-700' },
    late: { label: 'En retard', color: 'bg-yellow-100 text-yellow-700' },
    absent: { label: 'Absent', color: 'bg-red-100 text-red-700' },
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Pointages récents
        </h3>
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          Voir tout →
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Employé
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Entrée
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Sortie
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendances.map((attendance) => (
              <tr key={attendance.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm">
                        {attendance.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attendance.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {attendance.code}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                  {attendance.clockIn}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                  {attendance.clockOut}
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[attendance.status].color}`}>
                    {statusConfig[attendance.status].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

