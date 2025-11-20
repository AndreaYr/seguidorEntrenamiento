import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockEstadisticas } from '../../data/mockData';
import axios from 'axios';
import { toast } from 'react-toastify';

const EstadisticaDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const estadistica = mockEstadisticas.find(e => String(e.id) === String(id));

  if (!estadistica) {
    return (
      <DashboardLayout>
        <div>
          <h2>No encontrado</h2>
          <button onClick={() => navigate('/estadisticas')}>Volver</button>
        </div>
      </DashboardLayout>
    );
  }

  const handleDelete = async () => {
    try {
      // Intentar eliminar en backend; si falla, navegamos igual y usamos state para actualizar UI
      if (id) {
        await axios.delete(`http://localhost:3000/reportes/${id}`);
      }
      toast.success('✅ Reporte eliminado');
      navigate('/estadisticas', { state: { deletedId: Number(id) } });
    } catch (error) {
      console.error('Error eliminando reporte:', error);
      toast.error('❌ Error eliminando el reporte (se actualiza la vista localmente)');
      // En caso de fallo de backend, igualmente regresamos y notificamos al listado para filtrar
      navigate('/estadisticas', { state: { deletedId: Number(id) } });
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Eliminar Reporte</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-red-800 mb-4">⚠️ Confirmar Eliminación</h2>
          <p><span className="font-semibold">Periodo:</span> {estadistica.periodoInicio} - {estadistica.periodoFin}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleDelete} className="px-6 py-2 bg-red-600 text-white rounded">🗑️ Sí, Eliminar</button>
          <button onClick={() => navigate('/estadisticas')} className="px-6 py-2 bg-gray-500 text-white rounded">Cancelar</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EstadisticaDelete;


