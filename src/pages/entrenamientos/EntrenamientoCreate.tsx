/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DashboardLayout from '../../layouts/DashboardLayout';

interface Deportista {
  id_deportista: number;
  id_usuario: number;
  id_entrenador: number | null;
  genero: string | null;
  fechaNacimiento: string | null;
  peso: number;
  altura: number;
  usuario?: {
    primerNombre: string;
    segundoNombre: string | null;
    primerApellido: string;
    segundoApellido: string | null;
    correo: string;
  };
}

interface EntrenamientoFormData {
  disciplina: string;
  fecha: string;
  duracion: string;
  distancia: string;
  velocidadPromedio: string;
  caloriasQuemadas: string;
  frecuenciaCardiaca: string;
  id_deportista: string;
}

// Disciplinas que requieren distancia
const disciplinasConDistancia = ['running', 'ciclismo', 'natacion', 'caminata'];
// Disciplinas que requieren velocidad
const disciplinasConVelocidad = ['running', 'ciclismo', 'natacion'];

const EntrenamientoCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
  const [cargandoDeportistas, setCargandoDeportistas] = useState(true);
  
  const [formData, setFormData] = useState<EntrenamientoFormData>({
    disciplina: 'running',
    fecha: new Date().toISOString().split('T')[0],
    duracion: '',
    distancia: '',
    velocidadPromedio: '',
    caloriasQuemadas: '',
    frecuenciaCardiaca: '',
    id_deportista: ''
  });

  // Cargar deportistas desde el backend
  useEffect(() => {
    const cargarDeportistas = async () => {
      try {
        setCargandoDeportistas(true);
        const response = await axios.get('http://localhost:3000/entrenamientos');
        console.log('Deportistas cargados:', response.data);
        setDeportistas(response.data);
        
        // Establecer el primer deportista como valor por defecto
        if (response.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            id_deportista: response.data[0].id_deportista.toString()
          }));
        }
      } catch (error) {
        console.error('Error cargando deportistas:', error);
        toast.error('Error al cargar los deportistas');
      } finally {
        setCargandoDeportistas(false);
      }
    };

    cargarDeportistas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    console.log(`🔄 Cambio en campo ${name}:`, value);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si cambia la disciplina, limpiar campos que no aplican
    if (name === 'disciplina') {
      console.log('🔄 Cambiando disciplina a:', value);
      
      setFormData(prev => ({
        ...prev,
        disciplina: value,
        ...(!disciplinasConDistancia.includes(value) && { distancia: '' }),
        ...(!disciplinasConVelocidad.includes(value) && { velocidadPromedio: '' })
      }));
    }
  };

  const validateForm = (): boolean => {
    // Campos obligatorios para todas las disciplinas
    if (!formData.disciplina || !formData.fecha || !formData.duracion || !formData.id_deportista) {
      toast.error('Todos los campos marcados con * son obligatorios');
      return false;
    }

    if (parseInt(formData.duracion) <= 0) {
      toast.error('La duración debe ser mayor a 0');
      return false;
    }

    // Validar distancia solo para disciplinas que la requieren
    if (disciplinasConDistancia.includes(formData.disciplina)) {
      if (!formData.distancia || parseFloat(formData.distancia) <= 0) {
        toast.error('La distancia debe ser mayor a 0 para esta disciplina');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Enviando formulario con datos:', formData);
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const dataToSend: any = {
        disciplina: formData.disciplina,
        fecha: formData.fecha,
        duracion: parseInt(formData.duracion),
        id_deportista: parseInt(formData.id_deportista)
      };

      // Solo incluir distancia si aplica para la disciplina y tiene valor
      if (disciplinasConDistancia.includes(formData.disciplina) && formData.distancia) {
        dataToSend.distancia = parseFloat(formData.distancia);
      }

      // Solo incluir velocidad si aplica para la disciplina y tiene valor
      if (disciplinasConVelocidad.includes(formData.disciplina) && formData.velocidadPromedio) {
        dataToSend.velocidadPromedio = parseFloat(formData.velocidadPromedio);
      }

      // Campos opcionales para todas las disciplinas
      if (formData.caloriasQuemadas) {
        dataToSend.caloriasQuemadas = parseInt(formData.caloriasQuemadas);
      }

      if (formData.frecuenciaCardiaca) {
        dataToSend.frecuenciaCardiaca = parseInt(formData.frecuenciaCardiaca);
      }

      console.log('📤 Datos finales a enviar al servidor:', dataToSend);

      const response = await axios.post('http://localhost:3000/entrenamientos', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Respuesta del servidor:', response.data);

      if (response.data.success) {
        toast.success('Entrenamiento creado exitosamente!');
        navigate('/entrenamientos');
      } else {
        toast.error(`Error: ${response.data.error}`);
      }
    } catch (error: any) {
      console.error('❌ Error creando entrenamiento:', error);
      
      if (error.response?.data?.error) {
        toast.error(`Error: ${error.response.data.error}`);
      } else {
        toast.error('Error al crear el entrenamiento');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const getNombreCompleto = (deportista: Deportista) => {
    if (deportista.usuario) {
      return `${deportista.usuario.primerNombre} ${deportista.usuario.segundoNombre || ''} ${deportista.usuario.primerApellido} ${deportista.usuario.segundoApellido || ''}`.trim().replace(/\s+/g, ' ');
    }
    
    // Fallback si no viene el usuario
    return `Deportista ${deportista.id_deportista}`;
  };

  // Verificar si la disciplina actual requiere distancia
  const requiereDistancia = disciplinasConDistancia.includes(formData.disciplina);
  const requiereVelocidad = disciplinasConVelocidad.includes(formData.disciplina);

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Crear Nuevo Entrenamiento</h1>
          <button
            onClick={() => navigate('/entrenamientos')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            disabled={loading}
          >
            ← Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Disciplina *</label>
              <select
                name="disciplina"
                required
                value={formData.disciplina}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              >
                <option value="running">🏃 Running</option>
                <option value="ciclismo">🚴 Ciclismo</option>
                <option value="natacion">🏊 Natación</option>
                <option value="caminata">🚶 Caminata</option>
                <option value="crossfit">💪 CrossFit</option>
                <option value="yoga">🧘 Yoga</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Fecha *</label>
              <input
                type="date"
                name="fecha"
                required
                value={formData.fecha}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Duración (minutos) *</label>
              <input
                type="number"
                name="duracion"
                required
                min="1"
                value={formData.duracion}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
                placeholder="Ej: 60"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">
                Distancia (km) {requiereDistancia ? '*' : ''}
              </label>
              <input
                type="number"
                name="distancia"
                step="0.1"
                min="0.1"
                required={requiereDistancia}
                value={formData.distancia}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  !requiereDistancia ? 'bg-gray-100 text-gray-500' : ''
                }`}
                disabled={loading || !requiereDistancia}
                placeholder={requiereDistancia ? "Ej: 5.2" : "No aplica"}
              />
              {!requiereDistancia && (
                <p className="text-sm text-gray-500 mt-1">No aplica para {formData.disciplina}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">
                Velocidad Promedio (km/h) {requiereVelocidad ? '' : ''}
              </label>
              <input
                type="number"
                name="velocidadPromedio"
                step="0.1"
                value={formData.velocidadPromedio}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  !requiereVelocidad ? 'bg-gray-100 text-gray-500' : ''
                }`}
                disabled={loading || !requiereVelocidad}
                placeholder={requiereVelocidad ? "Opcional" : "No aplica"}
              />
              {!requiereVelocidad && (
                <p className="text-sm text-gray-500 mt-1">No aplica para {formData.disciplina}</p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-2">Calorías Quemadas</label>
              <input
                type="number"
                name="caloriasQuemadas"
                value={formData.caloriasQuemadas}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Frecuencia Cardíaca (bpm)</label>
              <input
                type="number"
                name="frecuenciaCardiaca"
                value={formData.frecuenciaCardiaca}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
                placeholder="Opcional"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Deportista *</label>
              {cargandoDeportistas ? (
                <div className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-500">
                  Cargando deportistas...
                </div>
              ) : (
                <select
                  name="id_deportista"
                  required
                  value={formData.id_deportista}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading || deportistas.length === 0}
                >
                  {deportistas.map(deportista => (
                    <option key={deportista.id_deportista} value={deportista.id_deportista}>
                      {getNombreCompleto(deportista)}
                    </option>
                  ))}
                </select>
              )}
              {deportistas.length === 0 && !cargandoDeportistas && (
                <p className="text-red-500 text-sm mt-1">No hay deportistas registrados</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || deportistas.length === 0}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creando...
                </>
              ) : (
                'Crear Entrenamiento'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/entrenamientos')}
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

export default EntrenamientoCreate;