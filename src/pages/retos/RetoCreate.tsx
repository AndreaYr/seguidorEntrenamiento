import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import type { EstadoReto } from '../../types';
import axios from 'axios';

const RetoCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracionDias: '', // será convertido a número antes de enviar
    estado: 'proximo' as EstadoReto
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      duracionDias: parseInt(formData.duracionDias, 10),
    };

    try {
      const response = await axios.post('http://localhost:3000/reto', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201 || response.status === 200) {
        alert('Reto Creado Exitosamente');
        navigate('/retos');
      } else {
        alert('Error al crear el reto');
      }
    } catch (error) {
      console.error('Error', error);
      alert('Error en la conexión con el servidor');
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Crear Nuevo Reto</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block font-semibold mb-2">Nombre del Reto *</label>
            <input
              type="text"
              name="nombre"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block font-semibold mb-2">Descripción *</label>
            <textarea
              name="descripcion"
              required
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block font-semibold mb-2">Estado *</label>
            <select
              name="estado"
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

          {/* Duración en Días */}
          <div>
            <label className="block font-semibold mb-2">Duración en Días *</label>
            <input
              type="number"
              name="duracionDias"
              required
              value={formData.duracionDias}
              onChange={(e) => setFormData({ ...formData, duracionDias: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded">✓ Crear</button>
            <button type="button" onClick={() => navigate('/retos')} className="px-6 py-2 bg-gray-500 text-white rounded">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default RetoCreate;