import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockRetos } from '../../data/mockData';
import type { Disciplina, EstadoReto } from '../../types';

const RetoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const reto = mockRetos.find(r => r.id === id);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    disciplina: 'running' as Disciplina,
    fechaInicio: '',
    fechaFin: '',
    objetivo: '',
    estado: 'proximo' as EstadoReto
  });

  useEffect(() => {
    if (reto) {
      setFormData({
        nombre: reto.nombre,
        descripcion: reto.descripcion,
        disciplina: reto.disciplina,
        fechaInicio: reto.fechaInicio,
        fechaFin: reto.fechaFin,
        objetivo: reto.objetivo,
        estado: reto.estado
      });
    }
  }, [reto]);

  if (!reto) {
    return <DashboardLayout><div><h2>No encontrado</h2><button onClick={() => navigate('/retos')}>Volver</button></div></DashboardLayout>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Reto actualizado!');
    navigate('/retos');
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Editar Reto</h1>
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

          <div className="flex gap-4">
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded">✓ Guardar</button>
            <button type="button" onClick={() => navigate('/retos')} className="px-6 py-2 bg-gray-500 text-white rounded">Cancelar</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default RetoEdit;


