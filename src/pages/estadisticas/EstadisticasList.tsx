import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from 'axios';

interface Deportista {
  id_deportista: number;
  nombre: string;
  apellido: string;
}

interface Reporte {
  id_reporte: number;
  id_deportista: number;
  fechaInicio: string;
  fechaFin: string;
  caloriasTotales: number;
  distanciaTotal: number;
  velocidadPromedio: number;
  entrenamientosRealizados: number;
}

const EstadisticasList = () => {
  const [estadisticas, setEstadisticas] = useState<Reporte[]>([]);
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const [reportesRes, deportistasRes] = await Promise.all([
          axios.get('http://localhost:3000/reportes'),
          axios.get('http://localhost:3000/deportistas')
        ]);
        setEstadisticas(reportesRes.data);
        setDeportistas(deportistasRes.data);
      }catch(error){
        console.error('❌ Error al cargar datos:', error);
      }
    }

    fetchData();
  }, []);

  const getDeportistaName = (id: number) => {
    const deportista = deportistas.find(u => u.id_deportista === id);
    return deportista ? `${deportista.nombre} ${deportista.apellido}` : id;
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

        {estadisticas.length === 0 ? (
          <p className="text-gray-600">No hay reportes generados aún.</p>

        ):(
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {estadisticas.map((est) => (
              <div
                key={est.id_reporte}
                className="border rounded-lg p-4 hover:shadow-lg transition"
              >
                <h3 className="font-bold text-lg mb-2">
                  {getDeportistaName(est.id_deportista)}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {est.fechaInicio} - {est.fechaFin}
                </p>
                <div className="space-y-2 mb-4">
                  <p>
                    <span className="font-semibold">Distancia Total:</span> {est.distanciaTotal} km
                  </p>
                  <p>
                    <span className="font-semibold">Calorías:</span> {est.caloriasTotales}
                  </p>
                  <p>
                    <span className="font-semibold">Velocidad Promedio:</span> {est.velocidadPromedio} km/h
                  </p>
                  <p>
                    <span className="font-semibold">Entrenamientos:</span> {est.entrenamientosRealizados}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/estadisticas/${est.id_reporte}`}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-center"
                  >
                    Ver
                  </Link>
                  <Link
                    to={`/estadisticas/eliminar/${est.id_reporte}`}
                    className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-center"
                  >
                    Eliminar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
  
export default EstadisticasList;


