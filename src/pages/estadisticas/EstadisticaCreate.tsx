/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from 'axios';

const EstadisticaCreate = () => {
  const navigate = useNavigate();
  const [deportistas, setDeportistas] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

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
        console.log('✅ Datos recibidos de deportistas:', response.data);
        
        setDeportistas(response.data);
      } catch (error) {
        console.error('❌ Error cargando deportistas', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDeportistas();
  }, []);

  // Función para obtener el nombre del deportista seleccionado
  const getNombreDeportista = () => {
    if (!formData.id_deportista) return '';
    
    const deportista = deportistas.find(
      dep => dep.id_deportista === Number(formData.id_deportista)
    );
    
    if (deportista && deportista.usuario) {
      const nombre = deportista.usuario.primerNombre || '';
      const apellido = deportista.usuario.primerApellido || '';
      
      return `${nombre} ${apellido}`.trim();
    }
    
    return 'Deportista no encontrado';
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

      alert('✅ Reporte generado exitosamente');
      navigate('/estadisticas');
    } catch (error) {
      console.error('Error al crear el reporte:', error);
      alert('❌ Error al generar el reporte');
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
              onChange={(e) => setFormData({ ...formData, id_deportista: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Seleccione un deportista</option>
              {deportistas.map(deportista => (
                <option 
                  key={deportista.id_deportista} 
                  value={deportista.id_deportista}
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