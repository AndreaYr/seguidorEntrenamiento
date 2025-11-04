import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import type { Disciplina, EstadoReto } from '../../types';

const RetoCreate = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    disciplina: 'running' as Disciplina,
    fechaInicio: '',
    fechaFin: '',
    objetivo: '',
    estado: 'proximo' as EstadoReto
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Reto creado exitosamente!');
    navigate('/retos');
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Crear Nuevo Reto</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">Nombre del Reto *</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Descripción *</label>
            <textarea
              required
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Disciplina *</label>
              <select
                required
                value={formData.disciplina}
                onChange={(e) => setFormData({ ...formData, disciplina: e.target.value as Disciplina })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="running">Running</option>
                <option value="ciclismo">Ciclismo</option>
                <option value="natacion">Natación</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Estado *</label>
              <select
                required
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as EstadoReto })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="proximo">Próximo</option>
                <option value="activo">Activo</option>
                <option value="finalizado">Finalizado</option>
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
            <input
              type="text"
              required
              value={formData.objetivo}
              onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Ej: Correr 100 km en 1 mes"
            />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded">✓ Crear</button>
            <button type="button" onClick={() => navigate('/retos')} className="px-6 py-2 bg-gray-500 text-white rounded">Cancelar</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default RetoCreate;


