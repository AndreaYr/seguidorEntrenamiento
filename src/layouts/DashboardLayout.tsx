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
    // Mostrar alerta personalizada
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">¿Estás seguro?</h3>
          <p class="text-gray-500 mb-6">¿Quieres cerrar sesión y salir del sistema?</p>
          <div class="flex gap-3 justify-center">
            <button id="cancel-btn" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium">
              Cancelar
            </button>
            <button id="confirm-btn" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
              Sí, Salir
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Manejar el botón de cancelar
    const cancelBtn = modal.querySelector('#cancel-btn') as HTMLButtonElement;
    cancelBtn.onclick = () => {
      document.body.removeChild(modal);
    };

    // Manejar el botón de confirmar
    const confirmBtn = modal.querySelector('#confirm-btn') as HTMLButtonElement;
    confirmBtn.onclick = () => {
      document.body.removeChild(modal);
      // Aquí puedes agregar lógica de logout si es necesario
      navigate('/');
    };

    // Cerrar modal haciendo clic fuera
    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    };
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