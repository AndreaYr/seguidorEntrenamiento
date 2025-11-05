import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from 'axios';
import type { Disciplina, EstadoReto } from '../../types';

type Reto = {
  id_reto: number;
  nombre: string;
  descripcion: string;
  disciplina: Disciplina;
  duracionDias: number;
  estado: EstadoReto;
};

const RetoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Reto>({
    id_reto: 0,
    nombre: '',
    descripcion: '',
    disciplina: 'running',
    duracionDias: 0,
    estado: 'proximo',
  });

  const [loading, setLoading] = useState(true);

  // 1️⃣ Traer los datos del reto desde el back
  useEffect(() => {
    const fetchReto = async () => {
      try {
        const response = await axios.get<Reto>(`http://localhost:3000/reto/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching reto:', error);
        alert('No se pudo cargar el reto');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReto();
  }, [id]);

  if (loading) return <DashboardLayout><div>Cargando...</div></DashboardLayout>;

  // 2️⃣ Enviar los cambios al back
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/reto/${formData.id_reto}`, formData);
      alert('Reto actualizado correctamente!');
      navigate('/retos');
    } catch (error) {
      console.error('Error actualizando reto:', error);
      alert('No se pudo actualizar el reto');
    }
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

          <div>
            <label className="block font-semibold mb-2">Descripción *</label>
            <textarea
              required
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Disciplina</label>
            <select
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
            <label className="block font-semibold mb-2">Duración (días)</label>
            <input
              type="number"
              value={formData.duracionDias}
              onChange={(e) => setFormData({ ...formData, duracionDias: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Estado</label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value as EstadoReto })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="activo">Activo</option>
              <option value="proximo">Próximo</option>
              <option value="finalizado">Finalizado</option>
            </select>
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
