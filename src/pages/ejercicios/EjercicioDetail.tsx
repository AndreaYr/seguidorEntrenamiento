import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockEjercicios, mockEntrenamientos } from '../../data/mockData';

const EjercicioDetail = () => {
  const { id } = useParams();
  const ejercicio = mockEjercicios.find(e => e.id === id);

  if (!ejercicio) {
    return (
      <DashboardLayout>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2>Ejercicio no encontrado</h2>
          <Link to="/ejercicios">Volver</Link>
        </div>
      </DashboardLayout>
    );
  }

  const entrenamiento = mockEntrenamientos.find(e => e.id === ejercicio.entrenamientoId);

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Detalle de Ejercicio</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Información</h3>
            <p><span className="font-semibold">Nombre:</span> {ejercicio.nombre}</p>
            <p>
              <span className="font-semibold">Intensidad:</span>{' '}
              <span className={`px-3 py-1 rounded-full text-sm ${
                ejercicio.intensidad === 'baja' ? 'bg-green-100 text-green-800' :
                ejercicio.intensidad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {ejercicio.intensidad.charAt(0).toUpperCase() + ejercicio.intensidad.slice(1)}
              </span>
            </p>
            <p><span className="font-semibold">Series:</span> {ejercicio.series}</p>
            <p><span className="font-semibold">Repeticiones:</span> {ejercicio.repeticiones}</p>
            {ejercicio.tiempo && <p><span className="font-semibold">Tiempo:</span> {ejercicio.tiempo} seg</p>}
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Entrenamiento</h3>
            <p>{entrenamiento ? `${entrenamiento.disciplina} - ${entrenamiento.fecha}` : ejercicio.entrenamientoId}</p>
            {ejercicio.notas && (
              <div className="mt-4">
                <h4 className="font-semibold">Notas:</h4>
                <p className="text-gray-700">{ejercicio.notas}</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex gap-4">
          <Link to={`/ejercicios/editar/${ejercicio.id}`} className="px-4 py-2 bg-yellow-500 text-white rounded">
            ✏️ Editar
          </Link>
          <Link to={`/ejercicios/eliminar/${ejercicio.id}`} className="px-4 py-2 bg-red-500 text-white rounded">
            🗑️ Eliminar
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EjercicioDetail;


