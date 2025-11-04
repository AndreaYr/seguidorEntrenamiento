import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockUsuarios } from '../../data/mockData';
import type { Disciplina } from '../../types';

const EntrenamientoCreate = () => {
  const navigate = useNavigate();
  const deportistas = mockUsuarios.filter(u => u.tipo === 'deportista');
  
  const [formData, setFormData] = useState({
    disciplina: 'running' as Disciplina,
    fecha: new Date().toISOString().split('T')[0],
    duracion: '',
    distancia: '',
    velocidadPromedio: '',
    caloriasQuemadas: '',
    frecuenciaCardiaca: '',
    deportistaId: deportistas[0]?.id || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Crear entrenamiento:', formData);
    alert('Entrenamiento creado exitosamente!');
    navigate('/entrenamientos');
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Crear Nuevo Entrenamiento</h1>
          <button
            onClick={() => navigate('/entrenamientos')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            ← Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Disciplina *</label>
              <select
                required
                value={formData.disciplina}
                onChange={(e) => setFormData({ ...formData, disciplina: e.target.value as Disciplina })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="running">Running</option>
                <option value="ciclismo">Ciclismo</option>
                <option value="natacion">Natación</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Fecha *</label>
              <input
                type="date"
                required
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Duración (min) *</label>
              <input
                type="number"
                required
                value={formData.duracion}
                onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Distancia (km) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.distancia}
                onChange={(e) => setFormData({ ...formData, distancia: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Velocidad Promedio (km/h) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.velocidadPromedio}
                onChange={(e) => setFormData({ ...formData, velocidadPromedio: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Calorías Quemadas *</label>
              <input
                type="number"
                required
                value={formData.caloriasQuemadas}
                onChange={(e) => setFormData({ ...formData, caloriasQuemadas: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Frecuencia Cardíaca</label>
              <input
                type="number"
                value={formData.frecuenciaCardiaca}
                onChange={(e) => setFormData({ ...formData, frecuenciaCardiaca: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Deportista *</label>
              <select
                required
                value={formData.deportistaId}
                onChange={(e) => setFormData({ ...formData, deportistaId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {deportistas.map(deportista => (
                  <option key={deportista.id} value={deportista.id}>
                    {deportista.nombres} {deportista.apellidos}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              ✓ Guardar
            </button>
            <button
              type="button"
              onClick={() => navigate('/entrenamientos')}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EntrenamientoCreate;


