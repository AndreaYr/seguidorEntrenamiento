import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface Usuario {
  primerNombre: string;
  segundoNombre: string | null;
  primerApellido: string;
  segundoApellido: string | null;
  correo: string;
}

interface Deportista {
  id_deportista: number;
  id_usuario: number;
  altura: number;
  peso: number;
  fechaNacimiento: string | null;
  genero: string | null;
  id_entrenador: number | null;
  usuario: Usuario;
}

interface Reporte {
  id_reporte: number;
  id_deportista: number;
  fechaInicio: string;
  fechaFin: string;
  caloriasTotales: number;
  distanciaTotal: number;
  velocidadPromedio: number;
  entrenamientosRealizados: number;
}

const EstadisticaDetail = () => {
  const { id } = useParams();
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reporteRes, deportistasRes] = await Promise.all([
          axios.get(`http://localhost:3000/reportes/${id}`),
          axios.get('http://localhost:3000/deportistas')
        ]);
        setReporte(reporteRes.data);
        setDeportistas(deportistasRes.data);
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getDeportistaName = (id: number) => {
    const deportista = deportistas.find(u => u.id_deportista === id);
    if (deportista && deportista.usuario) {
      const nombre = deportista.usuario.primerNombre || '';
      const apellido = deportista.usuario.primerApellido || '';
      return `${nombre} ${apellido}`.trim();
    }
    return `Deportista ${id}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Cargando...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!reporte) {
    return (
      <DashboardLayout>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Reporte no encontrado</h2>
          <Link 
            to="/estadisticas" 
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            ← Volver a Estadísticas
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Detalle de Reporte</h1>

        {/* Información del deportista y período */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold mb-3 text-blue-800">Información General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-gray-700">Deportista</p>
              <p className="text-lg">
                {getDeportistaName(reporte.id_deportista)}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Período del Reporte</p>
              <p className="text-gray-600">
                {reporte.fechaInicio} - {reporte.fechaFin}
              </p>
            </div>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Distancia Total</h3>
            <p className="text-3xl font-bold text-green-600">
              {reporte.distanciaTotal ?? 0} km
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-800 mb-2">Calorías Totales</h3>
            <p className="text-3xl font-bold text-orange-600">
              {reporte.caloriasTotales ?? 0}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">Velocidad Promedio</h3>
            <p className="text-3xl font-bold text-purple-600">
              {reporte.velocidadPromedio ?? 0} km/h
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Entrenamientos</h3>
            <p className="text-3xl font-bold text-blue-600">
              {reporte.entrenamientosRealizados ?? 0}
            </p>
          </div>
        </div>

        {/* Resumen adicional */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Resumen del Período</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-gray-700">Fecha de Inicio</p>
              <p className="text-gray-600">{reporte.fechaInicio}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Fecha de Fin</p>
              <p className="text-gray-600">{reporte.fechaFin}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">ID del Reporte</p>
              <p className="text-gray-600">#{reporte.id_reporte}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">ID del Deportista</p>
              <p className="text-gray-600">#{reporte.id_deportista}</p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-8 flex gap-4">
          <Link 
            to="/estadisticas" 
            className="px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
          >
            Volver a la lista
          </Link>
          <Link
            to={`/estadisticas/eliminar/${reporte.id_reporte}`}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Eliminar Reporte
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EstadisticaDetail;