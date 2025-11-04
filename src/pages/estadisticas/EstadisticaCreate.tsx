import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockUsuarios } from '../../data/mockData';

const EstadisticaCreate = () => {
  const navigate = useNavigate();
  const deportistas = mockUsuarios.filter(u => u.tipo === 'deportista');
  
  const [formData, setFormData] = useState({
    deportistaId: deportistas[0]?.id || '',
    periodoInicio: '',
    periodoFin: '',
    mejoraTiempos: '',
    incrementoResistencia: '',
    distanciaTotal: '',
    caloriasTotales: '',
    entrenamientosRealizados: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Reporte generado exitosamente!');
    navigate('/estadisticas');
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Generar Nuevo Reporte</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">Deportista *</label>
            <select
              required
              value={formData.deportistaId}
              onChange={(e) => setFormData({ ...formData, deportistaId: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {deportistas.map(deportista => (
                <option key={deportista.id} value={deportista.id}>
                  {deportista.nombres} {deportista.apellidos}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Periodo Inicio *</label>
              <input
                type="date"
                required
                value={formData.periodoInicio}
                onChange={(e) => setFormData({ ...formData, periodoInicio: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Periodo Fin *</label>
              <input
                type="date"
                required
                value={formData.periodoFin}
                onChange={(e) => setFormData({ ...formData, periodoFin: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Métricas de Progreso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Mejora de Tiempos (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.mejoraTiempos}
                  onChange={(e) => setFormData({ ...formData, mejoraTiempos: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Incremento Resistencia (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.incrementoResistencia}
                  onChange={(e) => setFormData({ ...formData, incrementoResistencia: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Distancia Total (km)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.distanciaTotal}
                  onChange={(e) => setFormData({ ...formData, distanciaTotal: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Calorías Totales</label>
                <input
                  type="number"
                  required
                  value={formData.caloriasTotales}
                  onChange={(e) => setFormData({ ...formData, caloriasTotales: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Entrenamientos Realizados</label>
            <input
              type="number"
              required
              value={formData.entrenamientosRealizados}
              onChange={(e) => setFormData({ ...formData, entrenamientosRealizados: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded">✓ Generar Reporte</button>
            <button type="button" onClick={() => navigate('/estadisticas')} className="px-6 py-2 bg-gray-500 text-white rounded">Cancelar</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EstadisticaCreate;


