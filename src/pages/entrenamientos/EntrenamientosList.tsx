import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  id_entrenador: number | null;
  // Estos campos vienen directamente del JOIN
  primerNombre?: string;
  primerApellido?: string;
  segundoNombre?: string | null;
  segundoApellido?: string | null;
}

const EntrenamientosList = () => {
  const navigate = useNavigate();
  const [entrenamientos, setEntrenamientos] = useState<Entrenamiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const cargarEntrenamientos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/entrenamientos');
      console.log('Entrenamientos cargados:', response.data);
      setEntrenamientos(response.data);
    } catch (error) {
      console.error('Error cargando entrenamientos:', error);
      toast.error('Error al cargar los entrenamientos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEntrenamientos();
  }, []);

  const handleEliminarEntrenamiento = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este entrenamiento?')) {
      return;
    }

    try {
      setDeletingId(id);
      await axios.delete(`http://localhost:3000/entrenamientos/${id}`);
      toast.success('Entrenamiento eliminado exitosamente');
      cargarEntrenamientos();
    } catch (error) {
      console.error('Error eliminando entrenamiento:', error);
      toast.error('Error al eliminar el entrenamiento');
    } finally {
      setDeletingId(null);
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES');
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

  const getNombreDeportista = (entrenamiento: Entrenamiento) => {
    // CORREGIDO: Los nombres vienen directamente en el objeto entrenamiento
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Cargando entrenamientos...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Entrenamientos</h1>
          <button
            onClick={() => navigate('/entrenamientos/crear')}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            + Nuevo Entrenamiento
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">
                  Disciplina
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">
                  Duración
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">
                  Distancia
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">
                  Deportista
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {entrenamientos.map((entrenamiento) => (
                <tr key={entrenamiento.id_entrenamiento} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b border-gray-200">
                    {entrenamiento.id_entrenamiento}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {getDisciplinaDisplay(entrenamiento.disciplina)}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {formatFecha(entrenamiento.fecha)}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {entrenamiento.duracion} min
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {entrenamiento.distancia} km
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {getNombreDeportista(entrenamiento)}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/entrenamientos/ver/${entrenamiento.id_entrenamiento}`)}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => navigate(`/entrenamientos/editar/${entrenamiento.id_entrenamiento}`)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminarEntrenamiento(entrenamiento.id_entrenamiento)}
                        disabled={deletingId === entrenamiento.id_entrenamiento}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition disabled:bg-red-300"
                      >
                        {deletingId === entrenamiento.id_entrenamiento ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {entrenamientos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏃‍♂️</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay entrenamientos registrados</h3>
            <p className="text-gray-500 mb-4">Comienza creando el primer entrenamiento</p>
            <button
              onClick={() => navigate('/entrenamientos/crear')}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Crear Primer Entrenamiento
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EntrenamientosList;