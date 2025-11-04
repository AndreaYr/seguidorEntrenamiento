import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockEjercicios, mockEntrenamientos } from '../../data/mockData';
import type { Intensidad } from '../../types';

const EjerciciosList = () => {
  const [ejercicios] = useState(mockEjercicios);
  const [filtroIntensidad, setFiltroIntensidad] = useState<Intensidad | 'todas'>('todas');

  const intensidades: Intensidad[] = ['baja', 'media', 'alta'];

  const ejerciciosFiltrados = ejercicios.filter(ej => 
    filtroIntensidad === 'todas' || ej.intensidad === filtroIntensidad
  );

  const getEntrenamientoInfo = (id: string) => {
    const ent = mockEntrenamientos.find(e => e.id === id);
    return ent ? `${ent.disciplina} - ${ent.fecha}` : id;
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Ejercicios</h1>
          <Link
            to="/ejercicios/crear"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            ➕ Nuevo Ejercicio
          </Link>
        </div>

        <div className="mb-4">
          <select
            value={filtroIntensidad}
            onChange={(e) => setFiltroIntensidad(e.target.value as Intensidad | 'todas')}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="todas">Todas las intensidades</option>
            {intensidades.map(int => (
              <option key={int} value={int}>
                {int.charAt(0).toUpperCase() + int.slice(1)}
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
                <th className="border p-3 text-left">Intensidad</th>
                <th className="border p-3 text-left">Series</th>
                <th className="border p-3 text-left">Repeticiones</th>
                <th className="border p-3 text-left">Entrenamiento</th>
                <th className="border p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ejerciciosFiltrados.map(ejercicio => (
                <tr key={ejercicio.id} className="hover:bg-gray-50">
                  <td className="border p-3">{ejercicio.id}</td>
                  <td className="border p-3 font-semibold">{ejercicio.nombre}</td>
                  <td className="border p-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      ejercicio.intensidad === 'baja' ? 'bg-green-100 text-green-800' :
                      ejercicio.intensidad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {ejercicio.intensidad.charAt(0).toUpperCase() + ejercicio.intensidad.slice(1)}
                    </span>
                  </td>
                  <td className="border p-3">{ejercicio.series}</td>
                  <td className="border p-3">{ejercicio.repeticiones}</td>
                  <td className="border p-3 text-sm">{getEntrenamientoInfo(ejercicio.entrenamientoId)}</td>
                  <td className="border p-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/ejercicios/${ejercicio.id}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                      >
                        Ver
                      </Link>
                      <Link
                        to={`/ejercicios/editar/${ejercicio.id}`}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
                      >
                        Editar
                      </Link>
                      <Link
                        to={`/ejercicios/eliminar/${ejercicio.id}`}
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

export default EjerciciosList;


