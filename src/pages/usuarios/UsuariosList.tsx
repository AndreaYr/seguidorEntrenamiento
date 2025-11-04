import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DashboardLayout from '../../layouts/DashboardLayout';

interface Usuario {
  id_usuario: number;
  correo: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  rol: 'deportista' | 'entrenador' | 'administrador';
  fechaRegistro: string;
}

const UsuarioList = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  // Cargar usuarios REALES desde el backend
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/usuarios');
      console.log('Usuarios cargados desde BD:', response.data);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      toast.error('Error al cargar los usuarios');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    const nombreCompleto = `${usuario.primerNombre} ${usuario.segundoNombre || ''} ${usuario.primerApellido} ${usuario.segundoApellido || ''}`.toLowerCase();
    const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase()) || 
                           usuario.correo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = filtroTipo === 'todos' || usuario.rol === filtroTipo;
    
    return coincideBusqueda && coincideTipo;
  });

  const handleEliminarUsuario = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      setDeletingId(id);
      await axios.delete(`http://localhost:3000/usuarios/${id}`);
      toast.success('Usuario eliminado exitosamente');
      cargarUsuarios();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      toast.error('Error al eliminar el usuario');
    } finally {
      setDeletingId(null);
    }
  };

  const getNombreCompleto = (usuario: Usuario) => {
    return `${usuario.primerNombre} ${usuario.segundoNombre || ''} ${usuario.primerApellido} ${usuario.segundoApellido || ''}`.trim().replace(/\s+/g, ' ');
  };

  const getRolBadge = (rol: string) => {
    const colors = {
      deportista: 'bg-blue-100 text-blue-800 border border-blue-200',
      entrenador: 'bg-green-100 text-green-800 border border-green-200',
      administrador: 'bg-purple-100 text-purple-800 border border-purple-200'
    };
    return colors[rol as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRolDisplay = (rol: string) => {
    const roles: { [key: string]: string } = {
      deportista: 'Deportista',
      entrenador: 'Entrenador',
      administrador: 'Administrador'
    };
    return roles[rol] || rol;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Cargando usuarios...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <button
            onClick={() => navigate('/usuarios/crear')}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <span>+</span>
            <span>Nuevo Usuario</span>
          </button>
        </div>

        {/* Filtros y búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por nombre o email
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por tipo
            </label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="todos">Todos los tipos</option>
              <option value="deportista">Deportista</option>
              <option value="entrenador">Entrenador</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-gray-600 font-semibold">Total</div>
            <div className="text-2xl font-bold text-gray-700">{usuarios.length}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-blue-600 font-semibold">Deportistas</div>
            <div className="text-2xl font-bold text-blue-700">
              {usuarios.filter(u => u.rol === 'deportista').length}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-green-600 font-semibold">Entrenadores</div>
            <div className="text-2xl font-bold text-green-700">
              {usuarios.filter(u => u.rol === 'entrenador').length}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-purple-600 font-semibold">Administradores</div>
            <div className="text-2xl font-bold text-purple-700">
              {usuarios.filter(u => u.rol === 'administrador').length}
            </div>
          </div>
        </div>

        {/* Tabla de usuarios REALES */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id_usuario} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{usuario.id_usuario}</div>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <div className="text-sm font-medium text-gray-900">
                      {getNombreCompleto(usuario)}
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <div className="text-sm text-gray-900">{usuario.correo}</div>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRolBadge(usuario.rol)}`}>
                      {getRolDisplay(usuario.rol)}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <div className="flex space-x-2">
                      {/* Acción VER */}
                      <button
                        onClick={() => navigate(`/usuarios/ver/${usuario.id_usuario}`)}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
                      >
                        Ver
                      </button>
                      {/* Acción EDITAR */}
                      <button
                        onClick={() => navigate(`/usuarios/editar/${usuario.id_usuario}`)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                      >
                        Editar
                      </button>
                      {/* Acción ELIMINAR */}
                      <button
                        onClick={() => handleEliminarUsuario(usuario.id_usuario)}
                        disabled={deletingId === usuario.id_usuario}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition disabled:bg-red-300"
                      >
                        {deletingId === usuario.id_usuario ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {usuarios.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay usuarios registrados</h3>
            <p className="text-gray-500 mb-4">Comienza creando el primer usuario en el sistema</p>
            <button
              onClick={() => navigate('/usuarios/crear')}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Crear Primer Usuario
            </button>
          </div>
        )}

        {usuarios.length > 0 && usuariosFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron usuarios que coincidan con la búsqueda
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsuarioList;