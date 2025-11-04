import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockEntrenamientos, mockUsuarios } from '../../data/mockData';

const EntrenamientoDetail = () => {
  const { id } = useParams();
  const entrenamiento = mockEntrenamientos.find(e => e.id === id);

  if (!entrenamiento) {
    return (
      <DashboardLayout>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Entrenamiento no encontrado</h2>
          <Link to="/entrenamientos" className="text-indigo-600 hover:underline">
            Volver a la lista
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const deportista = mockUsuarios.find(u => u.id === entrenamiento.deportistaId);

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Detalle de Entrenamiento</h1>
          <Link
            to="/entrenamientos"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            ← Volver
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Información General</h3>
            <p><span className="font-semibold">ID:</span> {entrenamiento.id}</p>
            <p>
              <span className="font-semibold">Disciplina:</span>{' '}
              <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                {entrenamiento.disciplina.charAt(0).toUpperCase() + entrenamiento.disciplina.slice(1)}
              </span>
            </p>
            <p><span className="font-semibold">Fecha:</span> {entrenamiento.fecha}</p>
            <p><span className="font-semibold">Duración:</span> {entrenamiento.duracion} minutos</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Métricas de Rendimiento</h3>
            <p><span className="font-semibold">Distancia:</span> {entrenamiento.distancia} km</p>
            <p><span className="font-semibold">Velocidad Promedio:</span> {entrenamiento.velocidadPromedio} km/h</p>
            <p><span className="font-semibold">Calorías:</span> {entrenamiento.caloriasQuemadas} kcal</p>
            {entrenamiento.frecuenciaCardiaca && (
              <p><span className="font-semibold">Frecuencia Cardíaca:</span> {entrenamiento.frecuenciaCardiaca} bpm</p>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded-lg md:col-span-2">
            <h3 className="font-semibold text-lg mb-4">Deportista</h3>
            <p>
              {deportista ? `${deportista.nombres} ${deportista.apellidos}` : entrenamiento.deportistaId}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Link
            to={`/entrenamientos/editar/${entrenamiento.id}`}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            ✏️ Editar
          </Link>
          <Link
            to={`/entrenamientos/eliminar/${entrenamiento.id}`}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            🗑️ Eliminar
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EntrenamientoDetail;


