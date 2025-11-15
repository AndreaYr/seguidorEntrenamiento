import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

const Dashboard = () => {
  
  

  return (
    <DashboardLayout>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Panel de Administración SportTrack</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Usuarios */}
          <Link to="/usuarios" className="block bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="text-4xl mb-3">👥</div>
            <h2 className="text-2xl font-bold mb-2">Usuarios</h2>
            <p className="text-blue-100">Gestiona deportistas, entrenadores y administradores</p>
          </Link>

          {/* Entrenamientos */}
          <Link to="/entrenamientos" className="block bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="text-4xl mb-3">🏃</div>
            <h2 className="text-2xl font-bold mb-2">Entrenamientos</h2>
            <p className="text-green-100">Registra y gestiona sesiones de entrenamiento</p>
          </Link>

          {/* Estadísticas */}
          <Link to="/estadisticas" className="block bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="text-4xl mb-3">📊</div>
            <h2 className="text-2xl font-bold mb-2">Estadísticas</h2>
            <p className="text-orange-100">Analiza el rendimiento y genera reportes</p>
          </Link>

          {/* Retos */}
          <Link to="/retos" className="block bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="text-4xl mb-3">🏆</div>
            <h2 className="text-2xl font-bold mb-2">Retos</h2>
            <p className="text-red-100">Gestiona competencias y desafíos</p>
          </Link>
        </div>

        
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;