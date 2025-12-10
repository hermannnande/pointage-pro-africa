const EmployeesPage = () => {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employés</h1>
          <p className="text-gray-600 mt-1">Gérez vos employés et leurs informations</p>
        </div>
        <button className="btn btn-primary">
          + Ajouter un employé
        </button>
      </div>

      <div className="card">
        <p className="text-gray-600 text-center py-12">
          Page en cours de développement - Gestion des employés à implémenter
        </p>
      </div>
    </div>
  );
};

export default EmployeesPage;

