/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockEntrenamientos } from '../../data/mockData';
import type { Disciplina } from '../../types';

const EntrenamientoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Permitimos `any` aquí porque los datos pueden venir en distintos shapes (mock vs backend).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [entrenamiento, setEntrenamiento] = useState<any | null>(null);
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
    const cargar = async () => {
      try {
        if (id) {
          // Intentar obtener desde backend
          const resp = await axios.get(`http://localhost:3000/entrenamientos/${id}`);
          setEntrenamiento(resp.data);
          return;
        }
      } catch (err) {
        // Si falla la petición, intentamos con los mocks
        console.warn('No se pudo obtener desde backend, se usará mock si existe', err);
      }

      // Si no encontramos en backend, buscar en mocks (coincidir por id)
      const found = mockEntrenamientos.find(e => e.id === id);
      if (found) {
        setEntrenamiento(found);
      } else {
        setEntrenamiento(null);
      }
    };

    cargar();
  }, [id]);

  useEffect(() => {
    if (!entrenamiento) return;

    // Mapear distintos shapes (backend puede devolver id_entrenamiento y nombres distintos)
    const e = entrenamiento as Record<string, unknown>;
    const disciplina = typeof e.disciplina === 'string' ? e.disciplina : '';
    const fecha = typeof e.fecha === 'string' ? e.fecha : '';
    const duracion = (typeof e.duracion === 'number' || typeof e.duracion === 'string') ? String(e.duracion) : '';
    const distancia = (typeof e.distancia === 'number' || typeof e.distancia === 'string') ? String(e.distancia) : '';
    const velocidadPromedio = (typeof e.velocidadPromedio === 'number' || typeof e.velocidadPromedio === 'string') ? String(e.velocidadPromedio) : '';
    const caloriasQuemadas = (typeof e.caloriasQuemadas === 'number' || typeof e.caloriasQuemadas === 'string') ? String(e.caloriasQuemadas) : '';
    const frecuenciaCardiaca = (typeof e.frecuenciaCardiaca === 'number' || typeof e.frecuenciaCardiaca === 'string') ? String(e.frecuenciaCardiaca) : '';
    const deportistaId = typeof e.deportistaId === 'string' ? e.deportistaId : (typeof e.id_deportista === 'string' ? e.id_deportista : '');

    setFormData({
      disciplina: disciplina as Disciplina,
      fecha: fecha as string,
      duracion,
      distancia,
      velocidadPromedio,
      caloriasQuemadas,
      frecuenciaCardiaca,
      deportistaId: deportistaId as string
    });
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
    const submit = async () => {
      try {
        // Construir payload similar al create
        const dataToSend: any = {
          disciplina: formData.disciplina,
          fecha: formData.fecha,
          duracion: parseInt(formData.duracion || '0', 10),
          // enviar id_deportista si existe
          ...(formData.deportistaId ? { id_deportista: parseInt(formData.deportistaId, 10) } : {})
        };

        // distancia: enviar 0 si está vacío para evitar notNull en el backend
        dataToSend.distancia = formData.distancia ? parseFloat(formData.distancia) : 0;

        if (formData.velocidadPromedio) dataToSend.velocidadPromedio = parseFloat(formData.velocidadPromedio);
        if (formData.caloriasQuemadas) dataToSend.caloriasQuemadas = parseInt(formData.caloriasQuemadas, 10);
        if (formData.frecuenciaCardiaca) dataToSend.frecuenciaCardiaca = parseInt(formData.frecuenciaCardiaca, 10);

        console.log('✏️ Enviando actualización:', dataToSend);

        const resp = await axios.put(`http://localhost:3000/entrenamientos/${id}`, dataToSend, {
          headers: { 'Content-Type': 'application/json' }
        });

        console.log('✅ Respuesta update:', resp.status, resp.data);

        if (resp.status >= 200 && resp.status < 300) {
          toast.success('Entrenamiento actualizado exitosamente');
          navigate('/entrenamientos');
        } else {
          const msg = resp.data?.error || resp.data?.message || 'Respuesta inesperada';
          toast.error(`Error: ${msg}`);
        }
      } catch (error: any) {
        console.error('❌ Error actualizando entrenamiento:', error);
        const resp = error.response;
        if (resp && resp.data) {
          const data = resp.data;
          const serverMsg = data.error || data.message || (Array.isArray(data) ? data.join(', ') : null);
          toast.error(`Error: ${serverMsg ?? JSON.stringify(data)}`);
        } else if (error.message) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error('Error al actualizar el entrenamiento');
        }
      }
    };

    submit();
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


