import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockEntrenamientos } from '../../data/mockData';
import type { Disciplina } from '../../types';

const EntrenamientoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const entrenamiento = mockEntrenamientos.find(e => e.id === id);
  
  const [formData, setFormData] = useState({
    disciplina: 'running' as Disciplina,
    fecha: '',
    duracion: '',
    distancia: '',
    velocidadPromedio: '',
    caloriasQuemadas: '',
    frecuenciaCardiaca: '',
    deportistaId: ''
  });

  useEffect(() => {
    if (entrenamiento) {
      setFormData({
        disciplina: entrenamiento.disciplina,
        fecha: entrenamiento.fecha,
        duracion: entrenamiento.duracion.toString(),
        distancia: entrenamiento.distancia.toString(),
        velocidadPromedio: entrenamiento.velocidadPromedio.toString(),
        caloriasQuemadas: entrenamiento.caloriasQuemadas.toString(),
        frecuenciaCardiaca: entrenamiento.frecuenciaCardiaca?.toString() || '',
        deportistaId: entrenamiento.deportistaId
      });
    }
  }, [entrenamiento]);

  if (!entrenamiento) {
    return (
      <DashboardLayout>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Entrenamiento no encontrado</h2>
          <button onClick={() => navigate('/entrenamientos')}>Volver</button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Entrenamiento actualizado exitosamente!');
    navigate('/entrenamientos');
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Editar Entrenamiento</h1>
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

          <div className="flex gap-4">
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              ✓ Guardar
            </button>
            <button type="button" onClick={() => navigate('/entrenamientos')} className="px-6 py-2 bg-gray-500 text-white rounded">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EntrenamientoEdit;


