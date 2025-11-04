import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { mockPlanes, mockUsuarios, mockEntrenamientos } from '../../data/mockData';

const PlanDetail = () => {
  const { id } = useParams();
  const plan = mockPlanes.find(p => p.id === id);

  if (!plan) {
    return (
      <DashboardLayout>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2>Plan no encontrado</h2>
          <Link to="/planes">Volver</Link>
        </div>
      </DashboardLayout>
    );
  }

  const entrenador = mockUsuarios.find(u => u.id === plan.entrenadorId);
  const deportistas = plan.deportistaIds.map(id => mockUsuarios.find(u => u.id === id)).filter(Boolean);
  const entrenamientos = plan.entrenamientoIds.map(id => mockEntrenamientos.find(e => e.id === id)).filter(Boolean);

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Detalle del Plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Información General</h3>
            <p><span className="font-semibold">Nombre:</span> {plan.nombre}</p>
            <p><span className="font-semibold">Objetivo:</span> {plan.objetivo}</p>
            <p><span className="font-semibold">Período:</span> {plan.fechaInicio} a {plan.fechaFin}</p>
            <p>
              <span className="font-semibold">Estado:</span>{' '}
              <span className={`px-3 py-1 rounded-full text-sm ${
                plan.estado === 'activo' ? 'bg-green-100 text-green-800' :
                plan.estado === 'completado' ? 'bg-gray-100 text-gray-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {plan.estado.charAt(0).toUpperCase() + plan.estado.slice(1)}
              </span>
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Entrenador</h3>
            <p>{entrenador ? `${entrenador.nombres} ${entrenador.apellidos}` : plan.entrenadorId}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg md:col-span-2">
            <h3 className="font-semibold text-lg mb-4">Deportistas</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {deportistas.map(deportista => (
                deportista && (
                  <div key={deportista.id} className="px-3 py-2 bg-white rounded border">
                    {deportista.nombres} {deportista.apellidos}
                  </div>
                )
              ))}
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg md:col-span-2">
            <h3 className="font-semibold text-lg mb-4">Entrenamientos Incluidos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {entrenamientos.map(ent => (
                ent && (
                  <div key={ent.id} className="px-3 py-2 bg-white rounded border">
                    <p className="font-semibold">{ent.disciplina}</p>
                    <p className="text-sm text-gray-600">{ent.fecha} - {ent.duracion} min</p>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Link to={`/planes/editar/${plan.id}`} className="px-4 py-2 bg-yellow-500 text-white rounded">
            ✏️ Editar
          </Link>
          <Link to={`/planes/eliminar/${plan.id}`} className="px-4 py-2 bg-red-500 text-white rounded">
            🗑️ Eliminar
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlanDetail;


