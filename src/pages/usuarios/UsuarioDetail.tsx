/* eslint-disable @typescript-eslint/no-explicit-any */
// UsuarioDetail.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  rol: string;
  fechaRegistro: string;
}

const UsuarioDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        setLoading(true);
        console.log('Cargando detalles del usuario ID:', id);
        const response = await axios.get(`http://localhost:3000/usuarios/${id}`);
        console.log('Usuario cargado:', response.data);
        setUsuario(response.data.data || response.data);
      } catch (error: any) {
        console.error('Error cargando usuario:', error);
        
        if (error.response?.status === 404) {
          toast.error('Usuario no encontrado');
        } else {
          toast.error('Error al cargar el usuario');
        }
        
        navigate('/usuarios');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarUsuario();
    }
  }, [id, navigate]);

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

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Cargando usuario...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!usuario) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Usuario no encontrado</h3>
          <button
            onClick={() => navigate('/usuarios')}
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Volver a Usuarios
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Detalle del Usuario</h1>
          <button
            onClick={() => navigate('/usuarios')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            ← Volver
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">ID</label>
              <div className="text-lg font-semibold text-gray-900">{usuario.id_usuario}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Nombre Completo</label>
              <div className="text-lg font-semibold text-gray-900">{getNombreCompleto(usuario)}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Correo Electrónico</label>
              <div className="text-lg text-gray-900">{usuario.correo}</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Tipo de Usuario</label>
              <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${getRolBadge(usuario.rol)}`}>
                {getRolDisplay(usuario.rol)}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de Registro</label>
              <div className="text-lg text-gray-900">{formatFecha(usuario.fechaRegistro)}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Estado</label>
              <div className="text-lg text-green-600 font-semibold">Activo</div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/usuarios/editar/${usuario.id_usuario}`)}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Editar Usuario
            </button>
            <button
              onClick={() => navigate('/usuarios')}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Volver a la Lista
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsuarioDetail;