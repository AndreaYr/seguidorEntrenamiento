import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockEntrenamientos, mockUsuarios } from '../../data/mockData';
import type { Disciplina } from '../../types';

const EntrenamientosList = () => {
  const [entrenamientos] = useState(mockEntrenamientos);
  const [filtroDisciplina, setFiltroDisciplina] = useState<Disciplina | 'todas'>('todas');

  const disciplinas: Disciplina[] = ['ciclismo', 'running', 'natacion'];

  const entrenamientosFiltrados = entrenamientos.filter(ent => 
    filtroDisciplina === 'todas' || ent.disciplina === filtroDisciplina
  );

  const getDeportistaName = (id: string) => {
    const usuario = mockUsuarios.find(u => u.id === id);
    return usuario ? `${usuario.nombres} ${usuario.apellidos}` : id;
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Entrenamientos</h1>
          <Link
            to="/entrenamientos/crear"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            ➕ Nuevo Entrenamiento
          </Link>
        </div>

        <div className="mb-4">
          <select
            value={filtroDisciplina}
            onChange={(e) => setFiltroDisciplina(e.target.value as Disciplina | 'todas')}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="todas">Todas las disciplinas</option>
            {disciplinas.map(disciplina => (
              <option key={disciplina} value={disciplina}>
                {disciplina.charAt(0).toUpperCase() + disciplina.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">ID</th>
                <th className="border p-3 text-left">Disciplina</th>
                <th className="border p-3 text-left">Fecha</th>
                <th className="border p-3 text-left">Duración</th>
                <th className="border p-3 text-left">Distancia</th>
                <th className="border p-3 text-left">Deportista</th>
                <th className="border p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {entrenamientosFiltrados.map(entrenamiento => (
                <tr key={entrenamiento.id} className="hover:bg-gray-50">
                  <td className="border p-3">{entrenamiento.id}</td>
                  <td className="border p-3">
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {entrenamiento.disciplina.charAt(0).toUpperCase() + entrenamiento.disciplina.slice(1)}
                    </span>
                  </td>
                  <td className="border p-3">{entrenamiento.fecha}</td>
                  <td className="border p-3">{entrenamiento.duracion} min</td>
                  <td className="border p-3">{entrenamiento.distancia} km</td>
                  <td className="border p-3">{getDeportistaName(entrenamiento.deportistaId)}</td>
                  <td className="border p-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/entrenamientos/${entrenamiento.id}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                      >
                        Ver
                      </Link>
                      <Link
                        to={`/entrenamientos/editar/${entrenamiento.id}`}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
                      >
                        Editar
                      </Link>
                      <Link
                        to={`/entrenamientos/eliminar/${entrenamiento.id}`}
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

export default EntrenamientosList;


