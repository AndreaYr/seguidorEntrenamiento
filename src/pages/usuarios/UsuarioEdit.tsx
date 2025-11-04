/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DashboardLayout from '../../layouts/DashboardLayout';

interface UsuarioFormData {
  correo: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  contrasenia: string;
  rol: 'deportista' | 'entrenador' | 'administrador';
}

const UsuarioEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);
  
  const [formData, setFormData] = useState<UsuarioFormData>({
    correo: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    contrasenia: '',
    rol: 'deportista'
  });

  // Cargar datos del usuario
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        setCargandoUsuario(true);
        console.log('🔄 Cargando usuario con ID:', id);
        
        const response = await axios.get(`http://localhost:3000/usuarios/${id}`);
        console.log('✅ Respuesta del servidor:', response.data);
        
        const usuario = response.data;
        console.log('📋 Datos del usuario:', usuario);
        
        setFormData({
          correo: usuario.correo || '',
          primerNombre: usuario.primerNombre || '',
          segundoNombre: usuario.segundoNombre || '',
          primerApellido: usuario.primerApellido || '',
          segundoApellido: usuario.segundoApellido || '',
          contrasenia: '', // No cargar la contraseña por seguridad
          rol: usuario.rol || 'deportista'
        });

        console.log('🎯 FormData actualizado:', {
          correo: usuario.correo || '',
          primerNombre: usuario.primerNombre || '',
          rol: usuario.rol || 'deportista'
        });

      } catch (error: any) {
        console.error('💥 Error cargando usuario:', error);
        console.error('📞 Detalles del error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        
        if (error.response?.status === 404) {
          toast.error('Usuario no encontrado');
        } else if (error.response?.status === 500) {
          toast.error('Error del servidor al cargar el usuario');
        } else {
          toast.error('Error al cargar el usuario');
        }
        
        navigate('/usuarios');
      } finally {
        setCargandoUsuario(false);
      }
    };

    if (id) {
      cargarUsuario();
    }
  }, [id, navigate]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validar formulario
  const validateForm = (): boolean => {
    if (!formData.correo || !formData.primerNombre || !formData.primerApellido) {
      toast.error('Los campos marcados con * son obligatorios');
      return false;
    }

    if (!formData.correo.includes('@')) {
      toast.error('El correo debe ser válido');
      return false;
    }

    // Solo validar contraseña si se está cambiando
    if (formData.contrasenia && formData.contrasenia.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  // Actualizar usuario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const dataToSend: any = {
        correo: formData.correo,
        primerNombre: formData.primerNombre,
        segundoNombre: formData.segundoNombre || null,
        primerApellido: formData.primerApellido,
        segundoApellido: formData.segundoApellido || null,
        rol: formData.rol
      };

      // Solo incluir contraseña si se está cambiando
      if (formData.contrasenia) {
        dataToSend.contrasenia = formData.contrasenia;
      }

      console.log('📤 Enviando datos de actualización:', dataToSend);

      const response = await axios.put(`http://localhost:3000/usuarios/${id}`, dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Respuesta de actualización:', response.data);

      if (response.status === 200) {
        toast.success('Usuario actualizado exitosamente!');
        navigate('/usuarios');
      }
    } catch (error: any) {
      console.error('💥 Error actualizando usuario:', error);
      console.error('📞 Detalles del error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 404) {
        toast.error('Usuario no encontrado');
      } else if (error.response?.status === 409) {
        toast.error('Error: El correo electrónico ya está registrado');
      } else if (error.response?.data?.error) {
        toast.error(`Error: ${error.response.data.error}`);
      } else {
        toast.error('Error al actualizar el usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  if (cargandoUsuario) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Cargando usuario ID: {id}...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Editar Usuario - ID: {id}</h1>
          <button
            onClick={() => navigate('/usuarios')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            disabled={loading}
          >
            ← Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Correo Electrónico *</label>
              <input
                type="email"
                name="correo"
                required
                value={formData.correo}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
                placeholder="ejemplo@correo.com"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Tipo de Usuario *</label>
              <select
                name="rol"
                required
                value={formData.rol}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              >
                <option value="deportista">Deportista</option>
                <option value="entrenador">Entrenador</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Primer Nombre *</label>
              <input
                type="text"
                name="primerNombre"
                required
                value={formData.primerNombre}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
                placeholder="Juan"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Segundo Nombre</label>
              <input
                type="text"
                name="segundoNombre"
                value={formData.segundoNombre}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
                placeholder="Carlos (opcional)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Primer Apellido *</label>
              <input
                type="text"
                name="primerApellido"
                required
                value={formData.primerApellido}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
                placeholder="Pérez"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Segundo Apellido</label>
              <input
                type="text"
                name="segundoApellido"
                value={formData.segundoApellido}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
                placeholder="García (opcional)"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Nueva Contraseña</label>
            <input
              type="password"
              name="contrasenia"
              value={formData.contrasenia}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
              placeholder="Dejar vacío para no cambiar"
              minLength={6}
            />
            <p className="text-sm text-gray-500 mt-1">Dejar vacío si no deseas cambiar la contraseña</p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:bg-indigo-400 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Actualizando...
                </>
              ) : (
                'Actualizar Usuario'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/usuarios')}
              disabled={loading}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition disabled:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default UsuarioEdit;