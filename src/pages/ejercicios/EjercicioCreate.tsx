import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockEntrenamientos } from '../../data/mockData';
import type { Intensidad } from '../../types';

const EjercicioCreate = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    intensidad: 'media' as Intensidad,
    series: '',
    repeticiones: '',
    tiempo: '',
    entrenamientoId: mockEntrenamientos[0]?.id || '',
    notas: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Ejercicio creado exitosamente!');
    navigate('/ejercicios');
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Crear Nuevo Ejercicio</h1>
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

          <div>
            <label className="block font-semibold mb-2">Entrenamiento *</label>
            <select
              required
              value={formData.entrenamientoId}
              onChange={(e) => setFormData({ ...formData, entrenamientoId: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {mockEntrenamientos.map(ent => (
                <option key={ent.id} value={ent.id}>
                  {ent.disciplina} - {ent.fecha}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Notas</label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              ✓ Guardar
            </button>
            <button type="button" onClick={() => navigate('/ejercicios')} className="px-6 py-2 bg-gray-500 text-white rounded">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EjercicioCreate;


