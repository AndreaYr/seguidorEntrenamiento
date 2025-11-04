import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockEntrenamientos } from '../../data/mockData';

const EntrenamientoDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const entrenamiento = mockEntrenamientos.find(e => e.id === id);

  if (!entrenamiento) {
    return (
      <DashboardLayout>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2>Entrenamiento no encontrado</h2>
          <button onClick={() => navigate('/entrenamientos')}>Volver</button>
        </div>
      </DashboardLayout>
    );
  }

  const handleDelete = () => {
    alert('Entrenamiento eliminado exitosamente!');
    navigate('/entrenamientos');
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Eliminar Entrenamiento</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-red-800 mb-4">⚠️ Confirmar Eliminación</h2>
          <p className="mb-4">¿Estás seguro de que deseas eliminar este entrenamiento?</p>
          <p><span className="font-semibold">Fecha:</span> {entrenamiento.fecha}</p>
          <p><span className="font-semibold">Disciplina:</span> {entrenamiento.disciplina}</p>
        </div>

        <div className="flex gap-4">
          <button onClick={handleDelete} className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            🗑️ Sí, Eliminar
          </button>
          <button onClick={() => navigate('/entrenamientos')} className="px-6 py-2 bg-gray-500 text-white rounded">
            Cancelar
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EntrenamientoDelete;


