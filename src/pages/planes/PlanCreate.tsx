import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockUsuarios } from '../../data/mockData';
import type { EstadoPlan } from '../../types';

const PlanCreate = () => {
  const navigate = useNavigate();
  const entrenadores = mockUsuarios.filter(u => u.tipo === 'entrenador');
  const deportistas = mockUsuarios.filter(u => u.tipo === 'deportista');
  
  const [formData, setFormData] = useState({
    nombre: '',
    entrenadorId: entrenadores[0]?.id || '',
    deportistaIds: [] as string[],
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: '',
    objetivo: '',
    estado: 'activo' as EstadoPlan,
    entrenamientoIds: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Plan creado exitosamente!');
    navigate('/planes');
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Crear Nuevo Plan</h1>
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
              <label className="block font-semibold mb-2">Estado *</label>
              <select
                required
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as EstadoPlan })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="activo">Activo</option>
                <option value="completado">Completado</option>
                <option value="pausado">Pausado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Fecha Inicio *</label>
              <input
                type="date"
                required
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Fecha Fin *</label>
              <input
                type="date"
                required
                value={formData.fechaFin}
                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Objetivo *</label>
            <textarea
              required
              value={formData.objetivo}
              onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Entrenador *</label>
            <select
              required
              value={formData.entrenadorId}
              onChange={(e) => setFormData({ ...formData, entrenadorId: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {entrenadores.map(entrenador => (
                <option key={entrenador.id} value={entrenador.id}>
                  {entrenador.nombres} {entrenador.apellidos}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Seleccionar Deportistas</label>
            <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
              {deportistas.map(deportista => (
                <label key={deportista.id} className="flex items-center gap-2 p-2 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.deportistaIds.includes(deportista.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, deportistaIds: [...formData.deportistaIds, deportista.id] });
                      } else {
                        setFormData({ ...formData, deportistaIds: formData.deportistaIds.filter(id => id !== deportista.id) });
                      }
                    }}
                  />
                  {deportista.nombres} {deportista.apellidos}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded">✓ Guardar</button>
            <button type="button" onClick={() => navigate('/planes')} className="px-6 py-2 bg-gray-500 text-white rounded">Cancelar</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PlanCreate;


