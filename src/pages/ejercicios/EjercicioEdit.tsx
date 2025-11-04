import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockEjercicios } from '../../data/mockData';
import type { Intensidad } from '../../types';

const EjercicioEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ejercicio = mockEjercicios.find(e => e.id === id);
  
  const [formData, setFormData] = useState({
    nombre: '',
    intensidad: 'media' as Intensidad,
    series: '',
    repeticiones: '',
    tiempo: '',
    entrenamientoId: '',
    notas: ''
  });

  useEffect(() => {
    if (ejercicio) {
      setFormData({
        nombre: ejercicio.nombre,
        intensidad: ejercicio.intensidad,
        series: ejercicio.series.toString(),
        repeticiones: ejercicio.repeticiones.toString(),
        tiempo: ejercicio.tiempo?.toString() || '',
        entrenamientoId: ejercicio.entrenamientoId,
        notas: ejercicio.notas || ''
      });
    }
  }, [ejercicio]);

  if (!ejercicio) {
    return (
      <DashboardLayout>
        <div><h2>No encontrado</h2><button onClick={() => navigate('/ejercicios')}>Volver</button></div>
      </DashboardLayout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Ejercicio actualizado!');
    navigate('/ejercicios');
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Editar Ejercicio</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Nombre *</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Intensidad *</label>
              <select
                required
                value={formData.intensidad}
                onChange={(e) => setFormData({ ...formData, intensidad: e.target.value as Intensidad })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-2">Series *</label>
              <input
                type="number"
                required
                value={formData.series}
                onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Repeticiones *</label>
              <input
                type="number"
                required
                value={formData.repeticiones}
                onChange={(e) => setFormData({ ...formData, repeticiones: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Tiempo (seg)</label>
              <input
                type="number"
                value={formData.tiempo}
                onChange={(e) => setFormData({ ...formData, tiempo: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded">✓ Guardar</button>
            <button type="button" onClick={() => navigate('/ejercicios')} className="px-6 py-2 bg-gray-500 text-white rounded">Cancelar</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EjercicioEdit;


