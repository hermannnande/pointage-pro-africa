import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { attendancesAPI } from '../services/api';
import {
  UserGroupIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className="text-sm text-gray-500 mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    present: 0,
    late: 0,
    absent: 0,
    total: 0,
  });
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await attendancesAPI.getAll({ date: today });
      
      const data = response.data.attendances;
      setAttendances(data);

      // Calculer les stats
      const present = data.filter(a => a.status === 'present' || a.status === 'late').length;
      const late = data.filter(a => a.status === 'late').length;
      const absent = data.filter(a => a.status === 'absent').length;

      setStats({
        present,
        late,
        absent,
        total: data.length,
      });
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      present: 'badge-success',
      late: 'badge-warning',
      absent: 'badge-danger',
      justified: 'badge-info',
      holiday: 'badge-neutral',
      leave: 'badge-info',
    };

    const labels = {
      present: 'Présent',
      late: 'En retard',
      absent: 'Absent',
      justified: 'Justifié',
      holiday: 'Férié',
      leave: 'Congé',
    };

    return (
      <span className={`badge ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bonjour, {user?.first_name} 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Voici un aperçu des présences d'aujourd'hui
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Employés présents"
          value={stats.present}
          icon={CheckCircleIcon}
          color="green"
          trend={`Sur ${stats.total} employés`}
        />
        <StatCard
          title="En retard"
          value={stats.late}
          icon={ClockIcon}
          color="yellow"
          trend="Aujourd'hui"
        />
        <StatCard
          title="Absents"
          value={stats.absent}
          icon={ExclamationTriangleIcon}
          color="red"
          trend="Non justifiés"
        />
        <StatCard
          title="Total employés"
          value={stats.total}
          icon={UserGroupIcon}
          color="blue"
          trend="Actifs"
        />
      </div>

      {/* Tableau des présences */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Présences du jour</h2>
          <button className="btn btn-primary">
            Exporter
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Chargement...</p>
          </div>
        ) : attendances.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucun pointage aujourd'hui</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Employé</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Poste</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Entrée</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Sortie</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Heures</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((attendance, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{attendance.user?.name}</p>
                        <p className="text-sm text-gray-500">{attendance.user?.employee_code}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{attendance.user?.job_title || '-'}</td>
                    <td className="py-4 px-4">
                      {attendance.attendance?.clock_in ? (
                        <span className="text-gray-900">
                          {new Date(attendance.attendance.clock_in).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {attendance.attendance?.clock_out ? (
                        <span className="text-gray-900">
                          {new Date(attendance.attendance.clock_out).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {attendance.attendance?.total_hours ? (
                        <span className="font-medium text-gray-900">
                          {attendance.attendance.total_hours}h
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(attendance.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

