import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Reto {
  id_reto: number;
  nombre: string;
  descripcion: string;
}

const RetoDelete = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reto, setReto] = useState<Reto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Cargar el reto desde el backend
  useEffect(() => {
    const fetchReto = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/reto/${id}`);
        setReto(response.data);
      } catch (err: unknown) {
        setError('Error cargando el reto');
        console.error('Error fetching reto:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReto();
  }, [id]);

  // ✅ Eliminar el reto
  const handleDelete = async () => {
    const confirmar = window.confirm('¿Seguro que deseas eliminar este reto?');
    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:3000/reto/${id}`);
      alert('✅ Reto eliminado con éxito');
      navigate('/retos');
    } catch (err: unknown) {
      console.error('Error eliminando reto:', err);
      alert('❌ Error al eliminar el reto');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-gray-700">Cargando reto...</div>
      </DashboardLayout>
    );
  }

  if (error || !reto) {
    return (
      <DashboardLayout>
        <div className="p-6 text-red-600">
          <h2 className="text-xl font-bold">Error</h2>
          <p>{error || 'Reto no encontrado'}</p>
          <button
            onClick={() => navigate('/retos')}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
          >
            Volver
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Eliminar Reto</h1>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-red-800 mb-4">⚠️ Confirmar Eliminación</h2>
          <p>
            <span className="font-semibold">Nombre:</span> {reto.nombre}
          </p>
          <p>
            <span className="font-semibold">Descripción:</span> {reto.descripcion}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🗑️ Sí, Eliminar
          </button>
          <button
            onClick={() => navigate('/retos')}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RetoDelete;
