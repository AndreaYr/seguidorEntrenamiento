/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

const UsuarioCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<UsuarioFormData>({
    correo: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    contrasenia: '',
    rol: 'deportista'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.correo || !formData.primerNombre || !formData.primerApellido || !formData.contrasenia) {
      toast.error('Todos los campos marcados con * son obligatorios');
      return false;
    }

    if (!formData.correo.includes('@')) {
      toast.error('El correo debe ser válido');
      return false;
    }

    if (formData.contrasenia.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // 🔥 Asegurarnos de que el rol se envíe correctamente
      const dataToSend = {
        correo: formData.correo,
        primerNombre: formData.primerNombre,
        segundoNombre: formData.segundoNombre || null,
        primerApellido: formData.primerApellido,
        segundoApellido: formData.segundoApellido || null,
        contrasenia: formData.contrasenia,
        rol: formData.rol // 🔥 Esto es lo importante
      };
      
      console.log('📤 Enviando datos al backend:', dataToSend);
      
      const response = await axios.post('http://localhost:3000/usuarios', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Respuesta del servidor:', response.data);

      if (response.status === 201 || response.status === 200) {
        toast.success(`Usuario ${formData.rol} creado exitosamente!`);
        navigate('/usuarios');
      }
    } catch (error: any) {
      console.error('💥 Error creando usuario:', error);
      console.error('📞 Detalles del error:', error.response?.data);
      
      if (error.response?.status === 409) {
        toast.error('Error: El correo electrónico ya está registrado');
      } else if (error.response?.data?.error) {
        toast.error(`Error: ${error.response.data.error}`);
      } else {
        toast.error('Error al crear el usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      correo: '',
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      contrasenia: '',
      rol: 'deportista'
    });
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Crear Nuevo Usuario</h1>
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
            <label className="block font-semibold mb-2">Contraseña *</label>
            <input
              type="password"
              name="contrasenia"
              required
              value={formData.contrasenia}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>

          {/* Información del tipo seleccionado */}
          {formData.rol === 'administrador' && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">⚠️ Creando Usuario Administrador</h3>
              <p className="text-purple-700 text-sm">
                Los administradores tienen acceso completo al sistema y pueden gestionar todos los usuarios y configuraciones.
              </p>
            </div>
          )}

          {formData.rol === 'entrenador' && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">👨‍🏫 Creando Usuario Entrenador</h3>
              <p className="text-green-700 text-sm">
                Los entrenadores pueden gestionar deportistas, crear entrenamientos y generar reportes.
              </p>
            </div>
          )}

          {formData.rol === 'deportista' && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">🏃‍♂️ Creando Usuario Deportista</h3>
              <p className="text-blue-700 text-sm">
                Los deportistas pueden registrar sus entrenamientos y ver su progreso.
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:bg-indigo-400 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creando...
                </>
              ) : (
                `Crear ${formData.rol.charAt(0).toUpperCase() + formData.rol.slice(1)}`
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition disabled:bg-yellow-300"
            >
              Limpiar
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

export default UsuarioCreate;