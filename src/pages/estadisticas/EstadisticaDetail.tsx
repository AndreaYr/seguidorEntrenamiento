import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockEstadisticas, mockUsuarios } from '../../data/mockData';

const EstadisticaDetail = () => {
  const { id } = useParams();
  const estadistica = mockEstadisticas.find(e => e.id === id);

  if (!estadistica) {
    return (
      <DashboardLayout>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2>Estadística no encontrada</h2>
          <Link to="/estadisticas">Volver</Link>
        </div>
      </DashboardLayout>
    );
  }

  const deportista = mockUsuarios.find(u => u.id === estadistica.deportistaId);

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Detalle de Estadísticas</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Deportista</h2>
          <p className="text-lg">{deportista ? `${deportista.nombres} ${deportista.apellidos}` : estadistica.deportistaId}</p>
          <p className="text-gray-600">Período: {estadistica.periodoInicio} - {estadistica.periodoFin}</p>
          <p className="text-gray-600">Generado: {estadistica.fechaGeneracion}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Mejora de Tiempos</h3>
            <p className="text-3xl font-bold text-blue-600">+{estadistica.metricas.mejoraTiempos.toFixed(1)}%</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Incremento Resistencia</h3>
            <p className="text-3xl font-bold text-green-600">+{estadistica.metricas.incrementoResistencia.toFixed(1)}%</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">Distancia Total</h3>
            <p className="text-3xl font-bold text-purple-600">{estadistica.metricas.distanciaTotal} km</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-800 mb-2">Calorías Totales</h3>
            <p className="text-3xl font-bold text-orange-600">{estadistica.metricas.caloriasTotales}</p>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Entrenamientos Realizados</h3>
          <p className="text-2xl font-bold">{estadistica.metricas.entrenamientosRealizados}</p>
        </div>

        <div className="mt-6 flex gap-4">
          <Link to="/estadisticas" className="px-4 py-2 bg-gray-500 text-white rounded">← Volver</Link>
          <Link to={`/estadisticas/eliminar/${estadistica.id}`} className="px-4 py-2 bg-red-500 text-white rounded">
            🗑️ Eliminar
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EstadisticaDetail;


