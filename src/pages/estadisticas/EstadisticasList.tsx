import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockEstadisticas, mockUsuarios } from '../../data/mockData';

const EstadisticasList = () => {
  const [estadisticas] = useState(mockEstadisticas);

  const getDeportistaName = (id: string) => {
    const usuario = mockUsuarios.find(u => u.id === id);
    return usuario ? `${usuario.nombres} ${usuario.apellidos}` : id;
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Estadísticas</h1>
          <Link
            to="/estadisticas/crear"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            ➕ Generar Reporte
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {estadisticas.map(est => (
            <div key={est.id} className="border rounded-lg p-4 hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-2">{getDeportistaName(est.deportistaId)}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {est.periodoInicio} - {est.periodoFin}
              </p>
              <div className="space-y-2 mb-4">
                <p><span className="font-semibold">Mejora:</span> +{est.metricas.mejoraTiempos.toFixed(1)}%</p>
                <p><span className="font-semibold">Distancia Total:</span> {est.metricas.distanciaTotal} km</p>
                <p><span className="font-semibold">Calorías:</span> {est.metricas.caloriasTotales}</p>
                <p><span className="font-semibold">Entrenamientos:</span> {est.metricas.entrenamientosRealizados}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/estadisticas/${est.id}`}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-center"
                >
                  Ver
                </Link>
                <Link
                  to={`/estadisticas/eliminar/${est.id}`}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-center"
                >
                  Eliminar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EstadisticasList;


