import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockPlanes, mockUsuarios } from '../../data/mockData';
import type { EstadoPlan } from '../../types';

const PlanesList = () => {
  const [planes] = useState(mockPlanes);
  const [filtroEstado, setFiltroEstado] = useState<EstadoPlan | 'todos'>('todos');

  const estados: EstadoPlan[] = ['activo', 'completado', 'pausado'];

  const planesFiltrados = planes.filter(plan => 
    filtroEstado === 'todos' || plan.estado === filtroEstado
  );

  const getUsuarioName = (id: string) => {
    const usuario = mockUsuarios.find(u => u.id === id);
    return usuario ? `${usuario.nombres} ${usuario.apellidos}` : id;
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Planes de Entrenamiento</h1>
          <Link
            to="/planes/crear"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            ➕ Nuevo Plan
          </Link>
        </div>

        <div className="mb-4">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as EstadoPlan | 'todos')}
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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">ID</th>
                <th className="border p-3 text-left">Nombre</th>
                <th className="border p-3 text-left">Entrenador</th>
                <th className="border p-3 text-left">Deportistas</th>
                <th className="border p-3 text-left">Estado</th>
                <th className="border p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {planesFiltrados.map(plan => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="border p-3">{plan.id}</td>
                  <td className="border p-3 font-semibold">{plan.nombre}</td>
                  <td className="border p-3">{getUsuarioName(plan.entrenadorId)}</td>
                  <td className="border p-3">
                    <div className="flex flex-wrap gap-1">
                      {plan.deportistaIds.map(id => (
                        <span key={id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {getUsuarioName(id)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="border p-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      plan.estado === 'activo' ? 'bg-green-100 text-green-800' :
                      plan.estado === 'completado' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {plan.estado.charAt(0).toUpperCase() + plan.estado.slice(1)}
                    </span>
                  </td>
                  <td className="border p-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/planes/${plan.id}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                      >
                        Ver
                      </Link>
                      <Link
                        to={`/planes/editar/${plan.id}`}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
                      >
                        Editar
                      </Link>
                      <Link
                        to={`/planes/eliminar/${plan.id}`}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                      >
                        Eliminar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlanesList;


