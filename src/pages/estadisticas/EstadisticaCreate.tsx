/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from 'axios';
import { toast } from 'react-toastify';

const EstadisticaCreate = () => {
  const navigate = useNavigate();
  const [deportistas, setDeportistas] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    id_deportista: '',
    fechaInicio: '',
    fechaFin: '',
    caloriasTotales: '',
    distanciaTotal: '',
    velocidadPromedio: '',
    entrenamientosRealizados: ''
  });

  // Obtener deportistas
  useEffect(() => {
    const fetchDeportistas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/deportistas');
        setDeportistas(response.data || []);
      } catch (error) {
        console.error('❌ Error cargando deportistas', error);
      }
    };

    fetchDeportistas();
  }, []);

  // Función para obtener el nombre del deportista seleccionado
  const getNombreDeportista = () => {
    if (!formData.id_deportista) return '';
    const deportista = deportistas.find(dep => String(dep.id_deportista) === String(formData.id_deportista));
    if (deportista && deportista.usuario) {
      const nombre = deportista.usuario.primerNombre || '';
      const apellido = deportista.usuario.primerApellido || '';
      return `${nombre} ${apellido}`.trim();
    }
    return 'Deportista no encontrado';
  };

  // Cargar estadísticas: primero intentar con entrenamientos, luego endpoints específicos
  const fetchEstadisticasDeportista = async (idDeportista: string) => {
    if (!idDeportista) return;
    setStatsLoading(true);
    try {
      const idNum = Number(idDeportista);

      // 1) Intentar obtener entrenamientos y calcular localmente
      try {
        const respTrain = await axios.get(`http://localhost:3000/entrenamientos?deportistaId=${idNum}`);
        const trainings = respTrain.data;
        if (Array.isArray(trainings) && trainings.length > 0) {
          const distanciaTotal = trainings.reduce((s: number, t: any) => s + (Number(t.distancia) || 0), 0);
          const caloriasTotales = trainings.reduce((s: number, t: any) => s + (Number(t.caloriasQuemadas) || 0), 0);
          const velocidadVals = trainings.map((t: any) => (t.velocidadPromedio != null ? Number(t.velocidadPromedio) : null)).filter((v: number | null) => v != null) as number[];
          const velocidadPromedio = velocidadVals.length > 0 ? (velocidadVals.reduce((a, b) => a + b, 0) / velocidadVals.length) : 0;
          const entrenamientosRealizados = trainings.length;
          const fechas = trainings.map((t: any) => new Date(t.fecha));
          const fechaInicioCalc = new Date(Math.min(...fechas.map(f => f.getTime()))).toISOString().split('T')[0];
          const fechaFinCalc = new Date(Math.max(...fechas.map(f => f.getTime()))).toISOString().split('T')[0];

          setFormData(prev => ({
            ...prev,
            distanciaTotal: String(Number(distanciaTotal.toFixed(1))),
            caloriasTotales: String(caloriasTotales),
            velocidadPromedio: String(Number(velocidadPromedio.toFixed(1))),
            entrenamientosRealizados: String(entrenamientosRealizados),
            fechaInicio: prev.fechaInicio || fechaInicioCalc,
            fechaFin: prev.fechaFin || fechaFinCalc
          }));

          const dep = deportistas.find(d => String(d.id_deportista) === String(idDeportista));
          const nombre = dep && dep.usuario ? `${dep.usuario.primerNombre || ''} ${dep.usuario.primerApellido || ''}`.trim() : '';
          toast.success(`📊 Estadísticas calculadas localmente para ${nombre || 'el deportista'}`);
          setStatsLoading(false);
          return;
        }
      } catch (trainErr: any) {
        // No hacer ruido, seguiremos intentando endpoints de estadísticas
        console.debug('No se pudieron obtener entrenamientos (seguir con endpoints):', trainErr?.message ?? trainErr);
      }

      // 2) Intentar endpoints de estadísticas
      try {
        let resp;
        try {
          resp = await axios.get(`http://localhost:3000/estadisticas/deportista/${idNum}`);
        } catch (_err: any) {
          console.debug('Error intentando endpoint específico de estadísticas:', _err);
          resp = await axios.get(`http://localhost:3000/estadisticas?deportistaId=${idNum}`);
        }

        const data = resp.data;
        const stats = Array.isArray(data) && data.length > 0 ? data[0] : data;

        if (stats) {
          setFormData(prev => ({
            ...prev,
            distanciaTotal: stats.distanciaTotal ?? stats.distancia_total ?? prev.distanciaTotal,
            caloriasTotales: stats.caloriasTotales ?? stats.calorias_totales ?? prev.caloriasTotales,
            velocidadPromedio: stats.velocidadPromedio ?? stats.velocidad_promedio ?? prev.velocidadPromedio,
            entrenamientosRealizados: stats.entrenamientosRealizados ?? stats.total_entrenamientos ?? prev.entrenamientosRealizados,
            fechaInicio: stats.periodo?.desde ?? stats.fechaInicio ?? prev.fechaInicio,
            fechaFin: stats.periodo?.hasta ?? stats.fechaFin ?? prev.fechaFin
          }));

          const dep = deportistas.find(d => String(d.id_deportista) === String(idDeportista));
          const nombre = dep && dep.usuario ? `${dep.usuario.primerNombre || ''} ${dep.usuario.primerApellido || ''}`.trim() : '';
          toast.success(`📊 Estadísticas cargadas para ${nombre || 'el deportista'}`);
          setStatsLoading(false);
          return;
        }
      } catch (statsErr: any) {
        console.debug('Endpoints de estadísticas no disponibles o sin datos:', statsErr?.message ?? statsErr);
      }

      toast.info('No se encontraron datos para este deportista');
      setStatsLoading(false);
    } catch (error: any) {
      console.error('Error cargando o calculando estadísticas:', error);
      toast.error('Error al cargar o calcular estadísticas del deportista');
      setStatsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {  
      await axios.post('http://localhost:3000/reportes', {
        id_deportista: Number(formData.id_deportista),
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        caloriasTotales: Number(formData.caloriasTotales),
        distanciaTotal: Number(formData.distanciaTotal),
        velocidadPromedio: Number(formData.velocidadPromedio),
        entrenamientosRealizados: Number(formData.entrenamientosRealizados)
      });

      toast.success('✅ Reporte generado exitosamente');
      navigate('/estadisticas');
    } catch (error) {
      console.error('Error al crear el reporte:', error);
      toast.error('❌ Error al generar el reporte');
    }
  };

  // Función para obtener el texto a mostrar en las opciones del select
  const getTextoOpcion = (deportista: any) => {
    if (deportista.usuario) {
      const nombre = deportista.usuario.primerNombre || '';
      const apellido = deportista.usuario.primerApellido || '';
      return `${nombre} ${apellido}`.trim();
    }
    return 'Nombre no disponible';
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Generar Nuevo Reporte</h1>

        {statsLoading && (
          <p className="text-sm text-gray-600 mb-3">Cargando estadísticas...</p>
        )}

        {/* Mostrar nombre del deportista seleccionado */}
        {formData.id_deportista && (
          <div className="mb-4 p-3 bg-green-100 rounded-lg border border-green-300">
            <p className="font-semibold text-green-800">
              📊 Generando reporte para: <span className="font-bold text-lg">{getNombreDeportista()}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2 text-gray-700">Deportista *</label>
            <select
              required
              value={formData.id_deportista}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({ ...formData, id_deportista: val });
                // cargar estadísticas del deportista seleccionado
                fetchEstadisticasDeportista(val);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Seleccione un deportista</option>
              {deportistas.map(deportista => (
                <option 
                  key={deportista.id_deportista} 
                  value={deportista.id_deportista?.toString() ?? String(deportista.id_deportista)}
                >
                  {getTextoOpcion(deportista)}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              {deportistas.length} deportistas disponibles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-gray-700">Fecha de Inicio *</label>
              <input
                type="date"
                required
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">Fecha Fin *</label>
              <input
                type="date"
                required
                value={formData.fechaFin}
                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-4 text-blue-800 text-lg">📈 Métricas de Progreso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">Calorías Totales (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.caloriasTotales}
                  onChange={(e) => setFormData({ ...formData, caloriasTotales: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ej: 85.5"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">Distancia Total (km)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.distanciaTotal}
                  onChange={(e) => setFormData({ ...formData, distanciaTotal: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ej: 25.3"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">Velocidad Promedio (km/h)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.velocidadPromedio}
                  onChange={(e) => setFormData({ ...formData, velocidadPromedio: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ej: 12.5"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">Entrenamientos Realizados</label>
                <input
                  type="number"
                  required
                  value={formData.entrenamientosRealizados}
                  onChange={(e) => setFormData({ ...formData, entrenamientosRealizados: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ej: 15"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition duration-200"
            >
            Generar Reporte
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/estadisticas')} 
              className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition duration-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EstadisticaCreate;