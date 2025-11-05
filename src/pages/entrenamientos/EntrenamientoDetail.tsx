/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DashboardLayout from '../../layouts/DashboardLayout';

interface Entrenamiento {
  id_entrenamiento: number;
  disciplina: string;
  fecha: string;
  duracion: number;
  distancia: number;
  velocidadPromedio: number | null;
  caloriasQuemadas: number | null;
  frecuenciaCardiaca: number | null;
  id_deportista: number;
  // Estos campos vienen directamente del JOIN (igual que en la lista)
  primerNombre?: string;
  primerApellido?: string;
  segundoNombre?: string | null;
  segundoApellido?: string | null;
}

const EntrenamientoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entrenamiento, setEntrenamiento] = useState<Entrenamiento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEntrenamiento = async () => {
      try {
        setLoading(true);
        console.log('Cargando entrenamiento con ID:', id);
        
        const response = await axios.get(`http://localhost:3000/entrenamientos/${id}`);
        console.log('Entrenamiento cargado:', response.data);
        
        setEntrenamiento(response.data);
      } catch (error: any) {
        console.error('Error cargando entrenamiento:', error);
        
        if (error.response?.status === 404) {
          toast.error('Entrenamiento no encontrado');
        } else {
          toast.error('Error al cargar el entrenamiento');
        }
        
        navigate('/entrenamientos');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarEntrenamiento();
    }
  }, [id, navigate]);

  const getNombreDeportista = (entrenamiento: Entrenamiento) => {
  // CORREGIDO: Usa los mismos campos que en la lista
  if (entrenamiento.primerNombre && entrenamiento.primerApellido) {
    const nombre = entrenamiento.primerNombre;
    const segundoNombre = entrenamiento.segundoNombre || '';
    const apellido = entrenamiento.primerApellido;
    const segundoApellido = entrenamiento.segundoApellido || '';
    
    return `${nombre} ${segundoNombre} ${apellido} ${segundoApellido}`
      .replace(/\s+/g, ' ')
      .trim();
      }
      return 'N/A';
    };

  const getDisciplinaDisplay = (disciplina: string) => {
    const disciplinas: { [key: string]: string } = {
      running: '🏃 Running',
      ciclismo: '🚴 Ciclismo',
      natacion: '🏊 Natación',
      caminata: '🚶 Caminata',
      crossfit: '💪 CrossFit',
      yoga: '🧘 Yoga'
    };
    return disciplinas[disciplina] || disciplina;
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este entrenamiento?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/entrenamientos/${id}`);
      toast.success('Entrenamiento eliminado exitosamente');
      navigate('/entrenamientos');
    } catch (error) {
      console.error('Error eliminando entrenamiento:', error);
      toast.error('Error al eliminar el entrenamiento');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Cargando entrenamiento...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!entrenamiento) {
    return (
      <DashboardLayout>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">Entrenamiento no encontrado</h2>
          <p className="text-gray-600 mb-4">El entrenamiento solicitado no existe o no se pudo cargar.</p>
          <Link 
            to="/entrenamientos" 
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Volver a la lista
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Detalle de Entrenamiento - ID: {entrenamiento.id_entrenamiento}
          </h1>
          <Link
            to="/entrenamientos"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            ← Volver
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información General */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">📋 Información General</h3>
            <div className="space-y-3">
              <p><span className="font-semibold text-gray-700">ID:</span> {entrenamiento.id_entrenamiento}</p>
              <p>
                <span className="font-semibold text-gray-700">Disciplina:</span>{' '}
                <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-medium">
                  {getDisciplinaDisplay(entrenamiento.disciplina)}
                </span>
              </p>
              <p><span className="font-semibold text-gray-700">Fecha:</span> {formatFecha(entrenamiento.fecha)}</p>
              <p><span className="font-semibold text-gray-700">Duración:</span> {entrenamiento.duracion} minutos</p>
            </div>
          </div>

          {/* Métricas de Rendimiento */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-lg mb-4 text-blue-800">📊 Métricas de Rendimiento</h3>
            <div className="space-y-3">
              <p><span className="font-semibold text-blue-700">Distancia:</span> {entrenamiento.distancia} km</p>
              <p>
                <span className="font-semibold text-blue-700">Velocidad Promedio:</span>{' '}
                {entrenamiento.velocidadPromedio ? `${entrenamiento.velocidadPromedio} km/h` : 'No registrada'}
              </p>
              <p>
                <span className="font-semibold text-blue-700">Calorías Quemadas:</span>{' '}
                {entrenamiento.caloriasQuemadas ? `${entrenamiento.caloriasQuemadas} kcal` : 'No registradas'}
              </p>
              <p>
                <span className="font-semibold text-blue-700">Frecuencia Cardíaca:</span>{' '}
                {entrenamiento.frecuenciaCardiaca ? `${entrenamiento.frecuenciaCardiaca} bpm` : 'No registrada'}
              </p>
            </div>
          </div>

          {/* Información del Deportista */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 md:col-span-2">
            <h3 className="font-semibold text-lg mb-4 text-green-800">👤 Deportista</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-green-700">
                  {getNombreDeportista(entrenamiento)}
                </p>
                <p className="text-sm text-green-600">
                  ID Deportista: {entrenamiento.id_deportista}
                </p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                🏃‍♂️ Deportista
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex gap-4">
            <Link
              to={`/entrenamientos/editar/${entrenamiento.id_entrenamiento}`}
              className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition flex items-center gap-2"
            >
              <span>✏️</span>
              <span>Editar Entrenamiento</span>
            </Link>
            <button
              onClick={handleEliminar}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-2"
            >
              <span>🗑️</span>
              <span>Eliminar Entrenamiento</span>
            </button>
            <Link
              to="/entrenamientos"
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Volver a la Lista
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EntrenamientoDetail;