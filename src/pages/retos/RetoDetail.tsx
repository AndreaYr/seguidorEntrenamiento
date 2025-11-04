import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockRetos, mockUsuarios } from '../../data/mockData';

const RetoDetail = () => {
  const { id } = useParams();
  const reto = mockRetos.find(r => r.id === id);

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

  const getUsuarioName = (userId: string) => {
    const usuario = mockUsuarios.find(u => u.id === userId);
    return usuario ? `${usuario.nombres} ${usuario.apellidos}` : userId;
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Detalle del Reto</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{reto.nombre}</h2>
          <p className="text-gray-700 mb-4">{reto.descripcion}</p>
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {reto.disciplina.charAt(0).toUpperCase() + reto.disciplina.slice(1)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              reto.estado === 'activo' ? 'bg-green-100 text-green-800' :
              reto.estado === 'finalizado' ? 'bg-gray-100 text-gray-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              {reto.estado.charAt(0).toUpperCase() + reto.estado.slice(1)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Fecha Inicio:</p>
              <p>{reto.fechaInicio}</p>
            </div>
            <div>
              <p className="font-semibold">Fecha Fin:</p>
              <p>{reto.fechaFin}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Objetivo:</p>
            <p className="text-lg">{reto.objetivo}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-lg mb-4">🏆 Clasificación</h3>
          {reto.participantes.length > 0 ? (
            <div className="space-y-2">
              {reto.participantes
                .sort((a, b) => a.posicion - b.posicion)
                .map(participante => (
                  <div key={participante.deportistaId} className="flex justify-between items-center bg-white p-3 rounded border">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">#{participante.posicion}</span>
                      <span className="font-semibold">{getUsuarioName(participante.deportistaId)}</span>
                    </div>
                    <span className="font-bold text-indigo-600">{participante.progreso}</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">Aún no hay participantes</p>
          )}
        </div>

        <div className="flex gap-4">
          <Link to="/retos" className="px-4 py-2 bg-gray-500 text-white rounded">← Volver</Link>
          <Link to={`/retos/editar/${reto.id}`} className="px-4 py-2 bg-yellow-500 text-white rounded">
            ✏️ Editar
          </Link>
          <Link to={`/retos/eliminar/${reto.id}`} className="px-4 py-2 bg-red-500 text-white rounded">
            🗑️ Eliminar
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RetoDetail;


