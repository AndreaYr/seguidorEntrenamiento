import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from 'axios';


const EstadisticaCreate = () => {
  const navigate = useNavigate();
  const [deportistas, setDeportistas] = useState<any[]>([]);
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

  //Obtener deportistas
  useEffect(() => {
    const fetchDeportistas = async () => {
      try{
        const response = await axios.get('http://localhost:3000/deportistas')
        setDeportistas(response.data);

      }catch(error){
        console.error('Error cargando deportistas', error);
      }finally{
        setLoading(false);
      }
    }
    fetchDeportistas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try{  
        await axios.post('http://localhost:3000/reportes', {
        id_deportista: Number(formData.id_deportista),
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        caloriasTotales: Number(formData.caloriasTotales),
        distanciaTotal: Number(formData.distanciaTotal),
        velocidadPromedio: Number(formData.velocidadPromedio),
        entrenamientosRealizados: Number(formData.entrenamientosRealizados)
      
      } );

      alert('✅ Reporte generado exitosamente');
      navigate('/estadisticas');
    }catch(error){
      console.error('Error al crear el reporte:', error);
      alert('❌ Error al generar el reporte');
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Generar Nuevo Reporte</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">Deportista *</label>
            <select
              required
              value={formData.id_deportista}
              onChange={(e) => setFormData({ ...formData, id_deportista: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg">
              <option value="">Seleccione un deportista</option> {/* ✅ Opción por defecto */}

              {deportistas.map(deportista => (
                <option key={deportista.id_deportista} value={deportista.id_deportista}>
                  {deportista.nombre} {deportista.apellido}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Fecha de Inicio *</label>
              <input
                type="date"
                required
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Fecha Fin *</label>
              <input
                type="date"
                required
                value={formData.fechaFin}
                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Métricas de Progreso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Calorias Totales (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.caloriasTotales}
                  onChange={(e) => setFormData({ ...formData, caloriasTotales: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2"> Distancia Total (km)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.distanciaTotal}
                  onChange={(e) => setFormData({ ...formData, distanciaTotal: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Velocidad Promedio </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.velocidadPromedio}
                  onChange={(e) => setFormData({ ...formData, velocidadPromedio: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Entrenamientos Realizados</label>
            <input
              type="number"
              required
              value={formData.entrenamientosRealizados}
              onChange={(e) => setFormData({ ...formData, entrenamientosRealizados: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded">✓ Generar Reporte</button>
            <button type="button" onClick={() => navigate('/estadisticas')} className="px-6 py-2 bg-gray-500 text-white rounded">Cancelar</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EstadisticaCreate;


