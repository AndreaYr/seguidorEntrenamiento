import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockUsuarios } from '../../data/mockData';

const UsuarioDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = mockUsuarios.find(u => u.id === id);

  if (!usuario) {
    return (
      <DashboardLayout>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Usuario no encontrado</h2>
          <Link to="/usuarios" className="text-indigo-600 hover:underline">
            Volver a la lista
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleDelete = () => {
    console.log('Eliminar usuario:', usuario.id);
    alert('Usuario eliminado exitosamente!');
    navigate('/usuarios');
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Eliminar Usuario</h1>
          <button
            onClick={() => navigate('/usuarios')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            ← Volver
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-red-800 mb-4">⚠️ Confirmar Eliminación</h2>
          <p className="text-gray-700 mb-4">
            ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
          </p>
          
          <div className="bg-white p-4 rounded border">
            <p><span className="font-semibold">Nombre:</span> {usuario.nombres} {usuario.apellidos}</p>
            <p><span className="font-semibold">Email:</span> {usuario.email}</p>
            <p><span className="font-semibold">Username:</span> {usuario.username}</p>
            <p><span className="font-semibold">Tipo:</span> {usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1)}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            🗑️ Sí, Eliminar
          </button>
          <button
            onClick={() => navigate('/usuarios')}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsuarioDelete;


