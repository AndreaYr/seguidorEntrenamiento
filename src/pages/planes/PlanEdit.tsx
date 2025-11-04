import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockPlanes } from '../../data/mockData';
import type { EstadoPlan } from '../../types';

const PlanEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const plan = mockPlanes.find(p => p.id === id);
  
  const [formData, setFormData] = useState({
    nombre: '',
    entrenadorId: '',
    deportistaIds: [] as string[],
    fechaInicio: '',
    fechaFin: '',
    objetivo: '',
    estado: 'activo' as EstadoPlan
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        nombre: plan.nombre,
        entrenadorId: plan.entrenadorId,
        deportistaIds: plan.deportistaIds,
        fechaInicio: plan.fechaInicio,
        fechaFin: plan.fechaFin,
        objetivo: plan.objetivo,
        estado: plan.estado
      });
    }
  }, [plan]);

  if (!plan) {
    return <DashboardLayout><div><h2>No encontrado</h2><button onClick={() => navigate('/planes')}>Volver</button></div></DashboardLayout>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Plan actualizado!');
    navigate('/planes');
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Editar Plan</h1>
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

          <div className="flex gap-4">
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded">✓ Guardar</button>
            <button type="button" onClick={() => navigate('/planes')} className="px-6 py-2 bg-gray-500 text-white rounded">Cancelar</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PlanEdit;


