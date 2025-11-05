import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'bg-indigo-700' : '';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-indigo-900 text-white p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-center">SportTrack</h2>
        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className={`block px-4 py-2 rounded hover:bg-indigo-700 transition ${
              location.pathname === '/dashboard' ? 'bg-indigo-700' : ''
            }`}
          >
            🏠 Inicio
          </Link>
          <Link
            to="/usuarios"
            className={`block px-4 py-2 rounded hover:bg-indigo-700 transition ${isActive('/usuarios')}`}
          >
            👥 Usuarios
          </Link>
          <Link
            to="/entrenamientos"
            className={`block px-4 py-2 rounded hover:bg-indigo-700 transition ${isActive('/entrenamientos')}`}
          >
            🏃 Entrenamientos
          </Link>
          <Link
            to="/ejercicios"
            className={`block px-4 py-2 rounded hover:bg-indigo-700 transition ${isActive('/ejercicios')}`}
          >
            💪 Ejercicios
          </Link>
          <Link
            to="/planes"
            className={`block px-4 py-2 rounded hover:bg-indigo-700 transition ${isActive('/planes')}`}
          >
            📋 Planes de Entrenamiento
          </Link>
          <Link
            to="/estadisticas"
            className={`block px-4 py-2 rounded hover:bg-indigo-700 transition ${isActive('/estadisticas')}`}
          >
            📊 Estadísticas
          </Link>
          <Link
            to="/retos"
            className={`block px-4 py-2 rounded hover:bg-indigo-700 transition ${isActive('/retos')}`}
          >
            🏆 Retos
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;


