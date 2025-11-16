/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'bg-indigo-700' : '';
  };

  const handleLogout = () => {
    // ... (código del logout permanece igual)
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-indigo-900 text-white p-4 shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex-1">
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
            {/* Nueva opción de Consultas Rápidas */}
            <Link
              to="/consultas"
              className={`block px-4 py-2 rounded hover:bg-indigo-700 transition ${isActive('/consultas')}`}
            >
              🔍 Consultas Rápidas
            </Link>
          </nav>
        </div>

        {/* Botón de salir */}
        <div className="pt-4 border-t border-indigo-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-white hover:bg-red-600 rounded transition duration-200"
          >
            <span className="mr-2">🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;