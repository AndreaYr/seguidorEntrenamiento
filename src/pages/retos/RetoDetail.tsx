import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from 'axios';
import { useState, useEffect } from 'react';
import type { EstadoReto } from '../../types';

type Usuario = {
  id_usuario: string;
  primerNombre: string;
  primerApellido: string;
};

type DeportistaRetoData = {
  id_deportista_reto: number;
  posicion: number;
  progreso: string;
};

type Deportista = {
  id_deportista: number;
  id_usuario: string;
  Usuario: Usuario;
  DeportistaReto: DeportistaRetoData;
};

type Reto = {
  id_reto: number;
  nombre: string;
  descripcion: string;
  duracionDias: number;
  estado: EstadoReto;
  Deportistas: Deportista[];
};

const RetoDetail = () => {
  const { id } = useParams();
  const [reto, setReto] = useState<Reto | null>(null);

  useEffect(() => {
    const fetchReto = async () => {
      try {
        const response = await axios.get<Reto>(`http://localhost:3000/reto/${id}`);
        setReto(response.data);
      } catch (error) {
        console.error('Error fetching reto:', error);
        setReto(null);
      }
    };

    fetchReto();
  }, [id]);

  if (!reto) {
    return (
      <DashboardLayout>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2>Reto no encontrado</h2>
          <Link to="/retos">Volver</Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Detalle del Reto</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{reto.nombre}</h2>
          <p className="text-gray-700 mb-4">{reto.descripcion}</p>
          <div className="flex gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              reto.estado === 'activo' ? 'bg-green-100 text-green-800' :
              reto.estado === 'finalizado' ? 'bg-gray-100 text-gray-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              {reto.estado.charAt(0).toUpperCase() + reto.estado.slice(1)}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-lg mb-4">🏆 Clasificación</h3>
          {reto.Deportistas && reto.Deportistas.length > 0 ? (
            <div className="space-y-2">
              {reto.Deportistas
                .sort((a, b) => a.DeportistaReto.posicion - b.DeportistaReto.posicion)
                .map(participante => (
                  <div key={participante.DeportistaReto.id_deportista_reto} className="flex justify-between items-center bg-white p-3 rounded border">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">#{participante.DeportistaReto.posicion}</span>
                      <span className="font-semibold">
                        {participante.Usuario ? `${participante.Usuario.primerNombre} ${participante.Usuario.primerApellido}` : 'Desconocido'}
                      </span>
                    </div>
                    <span className="font-bold text-indigo-600">{participante.DeportistaReto.progreso}</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">Aún no hay participantes</p>
          )}
        </div>

        <div className="flex gap-4">
          <Link to="/retos" className="px-4 py-2 bg-gray-500 text-white rounded">← Volver</Link>
          <Link to={`/retos/editar/${reto.id_reto}`} className="px-4 py-2 bg-yellow-500 text-white rounded">✏️ Editar</Link>
          <Link to={`/retos/eliminar/${reto.id_reto}`} className="px-4 py-2 bg-red-500 text-white rounded">🗑️ Eliminar</Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RetoDetail;
