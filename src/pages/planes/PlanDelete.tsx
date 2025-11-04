import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockPlanes } from '../../data/mockData';

const PlanDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const plan = mockPlanes.find(p => p.id === id);

  if (!plan) {
    return <DashboardLayout><div><h2>No encontrado</h2><button onClick={() => navigate('/planes')}>Volver</button></div></DashboardLayout>;
  }

  const handleDelete = () => {
    alert('Plan eliminado!');
    navigate('/planes');
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Eliminar Plan</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-red-800 mb-4">⚠️ Confirmar Eliminación</h2>
          <p><span className="font-semibold">Nombre:</span> {plan.nombre}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleDelete} className="px-6 py-2 bg-red-600 text-white rounded">🗑️ Sí, Eliminar</button>
          <button onClick={() => navigate('/planes')} className="px-6 py-2 bg-gray-500 text-white rounded">Cancelar</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlanDelete;


