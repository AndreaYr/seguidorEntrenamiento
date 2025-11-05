import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import type { EstadoReto } from '../../types';
import axios from 'axios';

const RetosList = () => {
  const [filtroEstado, setFiltroEstado] = useState<EstadoReto | 'todos'>('todos');
  const [retos, setRetos] = useState<Reto[]>([]);


  const estados: EstadoReto[] = ['activo', 'finalizado', 'proximo'];

  type Reto = {
    id_reto: number;
    nombre: string;
    descripcion: string;
    duracionDias: number;
    estado: EstadoReto;
};

  useEffect(() => {
    const fetchRetos = async () => {
      try{
        const response = await axios.get<Reto[]>('http://localhost:3000/reto');
        setRetos(response.data);
      }catch(error){
        console.error('Error fetching retos:', error);

      }
    }

    fetchRetos();
  }, []);

  const retosFiltrados = retos.filter(reto => 
    filtroEstado === 'todos' || reto.estado === filtroEstado
  );

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Retos</h1>
          <Link
            to="/retos/crear"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            ➕ Nuevo Reto
          </Link>
        </div>

        <div className="mb-4">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as EstadoReto | 'todos')}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="todos">Todos los estados</option>
            {estados.map(estado => (
              <option key={estado} value={estado}>
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {retosFiltrados.map(reto => (
            <div key={reto.id_reto} className="border rounded-lg p-4 hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-2">{reto.nombre}</h3>
              <p className="text-sm text-gray-600 mb-3">{reto.descripcion}</p>
              <div className="space-y-2 mb-4">
                <p className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    reto.estado === 'activo' ? 'bg-green-100 text-green-800' :
                    reto.estado === 'finalizado' ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {reto.estado.charAt(0).toUpperCase() + reto.estado.slice(1)}
                  </span>
                </p>

              </div>
              <div className="flex gap-2">
                <Link
                  to={`/retos/${reto.id_reto}`}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-center"
                >
                  Ver
                </Link>
                <Link
                  to={`/retos/editar/${reto.id_reto}`}
                  className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-center"
                >
                  Editar
                </Link>
                <Link
                  to={`/retos/eliminar/${reto.id_reto}`}
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

export default RetosList;


