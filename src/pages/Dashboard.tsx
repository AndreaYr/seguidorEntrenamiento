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

          {/* Ejercicios */}
          <Link to="/ejercicios" className="block bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="text-4xl mb-3">💪</div>
            <h2 className="text-2xl font-bold mb-2">Ejercicios</h2>
            <p className="text-purple-100">Administra ejercicios y rutinas</p>
          </Link>

          {/* Planes */}
          <Link to="/planes" className="block bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="text-4xl mb-3">📋</div>
            <h2 className="text-2xl font-bold mb-2">Planes de Entrenamiento</h2>
            <p className="text-indigo-100">Asigna planes a deportistas</p>
          </Link>

          {/* Estadísticas */}
          <Link to="/estadisticas" className="block bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="text-4xl mb-3">📊</div>
            <h2 className="text-2xl font-bold mb-2">Estadísticas</h2>
            <p className="text-orange-100">Analiza el rendimiento</p>
          </Link>

          {/* Retos */}
          <Link to="/retos" className="block bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="text-4xl mb-3">🏆</div>
            <h2 className="text-2xl font-bold mb-2">Retos</h2>
            <p className="text-red-100">Gestiona competencias y desafíos</p>
          </Link>
        </div>

        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-3">📈 Resumen Rápido</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">6</p>
              <p className="text-gray-600">Usuarios</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">6</p>
              <p className="text-gray-600">Entrenamientos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">6</p>
              <p className="text-gray-600">Ejercicios</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">3</p>
              <p className="text-gray-600">Estadísticas</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;


