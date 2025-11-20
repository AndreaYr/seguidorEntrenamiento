/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ConsultaData {
  [key: string]: any;
}

interface ConsultaConfig {
  id: string;
  nombre: string;
  descripcion: string;
  columnas: string[];
  icono: string;
  endpoint: string;
}

const ConsultasRapidas: React.FC = () => {
  const navigate = useNavigate();
  const [consultaSeleccionada, setConsultaSeleccionada] = useState<string>('');
  const [datos, setDatos] = useState<ConsultaData[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const consultas: ConsultaConfig[] = [
    {
      id: 'deportistas_entrenador',
      nombre: 'Deportistas por Entrenador',
      descripcion: 'Lista de deportistas agrupados por su entrenador asignado',
      columnas: ['nombre_entrenador', 'apellido_entrenador', 'nombre_deportista', 'apellido_deportista', 'correo_deportista', 'peso', 'altura'],
      icono: '👥',
      endpoint: '/consultas/deportistasPorEntrenador'
    },
    {
      id: 'entrenamientos_recientes',
      nombre: 'Entrenamientos Recientes',
      descripcion: 'Últimos 20 entrenamientos registrados en el sistema',
      columnas: ['nombre_deportista', 'apellido_deportista', 'fecha', 'duracion', 'distancia'],
      icono: '🏃',
      endpoint: '/consultas/entrenamientosRecientes'
    },
    {
      id: 'retos_activos',
      nombre: 'Retos Activos',
      descripcion: 'Retos activos con cantidad de participantes',
      columnas: ['id_reto', 'nombre', 'descripcion', 'duracion_dias', 'estado', 'total_participantes'],
      icono: '🏆',
      endpoint: '/consultas/retosActivos'
    },
    {
      id: 'progreso_mensual',
      nombre: 'Progreso Mensual',
      descripcion: 'Progreso de deportistas por mes',
      columnas: ['id_deportista', 'nombre', 'apellido', 'mes', 'distancia_total', 'tiempo_total_minutos', 'total_entrenamientos'],
      icono: '📈',
      endpoint: '/consultas/progresoMensual'
    },
    {
      id: 'estadisticas_basicas',
      nombre: 'Estadísticas Básicas',
      descripcion: 'Métricas generales del sistema',
      columnas: ['total_entrenamientos', 'distancia_promedio', 'duracion_promedio_minutos', 'deportistas_activos'],
      icono: '📊',
      endpoint: '/consultas/estadisticasDisciplina'
    },
    {
      id: 'ranking_deportistas',
      nombre: 'Ranking de Deportistas',
      descripcion: 'Top 15 deportistas por distancia total',
      columnas: ['id_deportista', 'nombre', 'apellido', 'correo', 'total_entrenamientos', 'distancia_total', 'tiempo_total_minutos'],
      icono: '🥇',
      endpoint: '/consultas/rankingDeportistas'
    },
    {
      id: 'participacion_retos',
      nombre: 'Participación en Retos',
      descripcion: 'Participación de deportistas en retos',
      columnas: ['id_deportista', 'nombre', 'apellido', 'total_retos_participados', 'retos_completados', 'retos_activos'],
      icono: '🎯',
      endpoint: '/consultas/participacionRetos'
    },
    {
      id: 'evolucion_rendimiento',
      nombre: 'Evolución del Rendimiento',
      descripcion: 'Evolución mensual del rendimiento por deportista',
      columnas: ['id_deportista', 'nombre', 'apellido', 'año', 'mes', 'mes_formateado', 'entrenamientos_mes', 'distancia_promedio', 'distancia_total_mes'],
      icono: '🚀',
      endpoint: '/consultas/evolucionRendimiento'
    },
    {
      id: 'consistencia_entrenamiento',
      nombre: 'Consistencia en Entrenamientos',
      descripcion: 'Consistencia y frecuencia de entrenamientos',
      columnas: ['id_deportista', 'nombre', 'apellido', 'total_entrenamientos', 'dias_entrenados', 'primera_fecha', 'ultima_fecha'],
      icono: '💪',
      endpoint: '/consultas/consistenciaEntrenamiento'
    },
    {
      id: 'metricas_generales',
      nombre: 'Métricas Generales',
      descripcion: 'Métricas generales del sistema',
      columnas: ['total_usuarios', 'total_deportistas', 'total_entrenadores', 'total_entrenamientos', 'deportistas_activos', 'distancia_promedio', 'total_retos', 'retos_activos', 'retos_finalizados'],
      icono: '🔍',
      endpoint: '/consultas/metricasGenerales'
    }
  ];

  const ejecutarConsulta = async (consultaId: string) => {
    if (!consultaId) return;

    setCargando(true);
    setError('');
    
    try {
      const consulta = consultas.find(c => c.id === consultaId);
      if (!consulta) {
        throw new Error('Consulta no encontrada');
      }

      console.log(`🔍 Ejecutando: ${consulta.nombre}`);
      console.log(`📡 Endpoint: ${consulta.endpoint}`);

      const response = await fetch(`http://localhost:3000${consulta.endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`📊 Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log('📦 Respuesta completa:', result);
      
      let datosReales;
      
      // Manejar diferentes formatos de respuesta
      if (result.success !== undefined) {
        // Formato: { success: true, data: [...] }
        datosReales = result.data;
        console.log('✅ Formato con campo success detectado');
      } else {
        // Formato directo: [...]
        datosReales = result;
        console.log('✅ Formato directo de array detectado');
      }
      
      console.log('📊 Datos a mostrar:', datosReales);
      
      // Procesar los datos según el tipo
      if (Array.isArray(datosReales)) {
        setDatos(datosReales);
        console.log(`✅ ${datosReales.length} registros cargados en tabla`);
      } else if (typeof datosReales === 'object' && datosReales !== null) {
        // Caso especial para métricas generales que es un objeto único
        setDatos([datosReales]);
        console.log('✅ Objeto único convertido a array de 1 elemento');
      } else {
        setDatos([]);
        console.log('❌ No se pudieron procesar los datos');
      }
      
    } catch (err) {
      console.error('❌ Error ejecutando consulta:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al conectar con el servidor');
      setDatos([]);
    } finally {
      setCargando(false);
    }
  };

  const handleConsultaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const consultaId = e.target.value;
    setConsultaSeleccionada(consultaId);
    if (consultaId) {
      ejecutarConsulta(consultaId);
    } else {
      setDatos([]);
    }
  };

  const formatearNombreColumna = (columna: string): string => {
    return columna
      .split('_')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  };

  const formatearValor = (valor: any): string => {
    if (valor === null || valor === undefined) return '-';
    if (typeof valor === 'number') {
      return valor % 1 === 0 ? valor.toString() : valor.toFixed(2);
    }
    if (typeof valor === 'boolean') {
      return valor ? 'Sí' : 'No';
    }
    return String(valor);
  };

  const handleVolverAtras = () => {
    navigate(-1);
  };

  const consultaActual = consultas.find(c => c.id === consultaSeleccionada);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      {/* Header con botón volver */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleVolverAtras}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 transition duration-200 shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver Atrás
          </button>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <span className="text-2xl text-white">🔍</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Consultas Rápidas</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ejecuta consultas predefinidas para obtener información rápida y insights del sistema SportTrack
          </p>
        </div>
      </div>

      {/* Selector de Consultas */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-indigo-100">
        <div className="flex items-center mb-4">
          <div className="w-2 h-8 bg-indigo-600 rounded-full mr-3"></div>
          <h2 className="text-xl font-semibold text-gray-800">Selecciona una Consulta</h2>
        </div>
        
        <label htmlFor="consulta" className="block text-sm font-medium text-gray-700 mb-3">
          Elige entre nuestras consultas predefinidas:
        </label>
        <select
          id="consulta"
          value={consultaSeleccionada}
          onChange={handleConsultaChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-800 transition duration-200"
        >
          <option value="">-- Selecciona una consulta --</option>
          {consultas.map(consulta => (
            <option key={consulta.id} value={consulta.id} className="flex items-center">
              {consulta.icono} {consulta.nombre}
            </option>
          ))}
        </select>
        
        {consultaActual && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex items-start">
              <span className="text-2xl mr-3 mt-1">{consultaActual.icono}</span>
              <div>
                <h3 className="font-semibold text-indigo-800">{consultaActual.nombre}</h3>
                <p className="text-sm text-indigo-600 mt-1">{consultaActual.descripcion}</p>
                <p className="text-xs text-indigo-500 mt-2">
                  Endpoint: {consultaActual.endpoint}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estado de carga */}
      {cargando && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center border border-indigo-100">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">Ejecutando consulta...</p>
          <p className="text-sm text-gray-500 mt-2">Conectando con el servidor</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Error en la consulta</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button 
                onClick={() => ejecutarConsulta(consultaSeleccionada)}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resultados */}
      {!cargando && datos.length > 0 && consultaActual && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {consultaActual.icono} {consultaActual.nombre}
                </h3>
                <p className="text-indigo-100 text-sm mt-1">
                  {datos.length} registro(s) encontrado(s)
                </p>
              </div>
              <div className="text-indigo-100 text-sm font-medium bg-white bg-opacity-20 rounded-lg px-3 py-1">
                Datos en tiempo real
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {consultaActual.columnas.map(columna => (
                    <th
                      key={columna}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-indigo-50"
                    >
                      {formatearNombreColumna(columna)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {datos.map((fila, index) => (
                  <tr 
                    key={index} 
                    className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100 transition duration-150'}
                  >
                    {consultaActual.columnas.map(columna => (
                      <td
                        key={columna}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                      >
                        {formatearValor(fila[columna])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              ✅ <strong>Datos actualizados:</strong> Información en tiempo real del sistema
            </p>
          </div>
        </div>
      )}

      {/* Sin resultados */}
      {!cargando && consultaSeleccionada && datos.length === 0 && !error && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-indigo-100">
          <div className="text-indigo-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron resultados</h3>
          <p className="text-gray-600 mb-4">La consulta no devolvió datos para mostrar.</p>
          <button 
            onClick={() => setConsultaSeleccionada('')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
          >
            Probar otra consulta
          </button>
        </div>
      )}

      {/* Estado inicial */}
      {!consultaSeleccionada && !cargando && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-indigo-100">
          <div className="text-indigo-400 mb-6">
            <svg className="mx-auto h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Explora tus datos</h3>
          <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
            Selecciona una de las consultas disponibles del menú desplegable para obtener insights rápidos sobre tu sistema SportTrack.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {consultas.slice(0, 6).map(consulta => (
              <div 
                key={consulta.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition duration-200 cursor-pointer"
                onClick={() => setConsultaSeleccionada(consulta.id)}
              >
                <div className="text-2xl mb-2">{consulta.icono}</div>
                <h4 className="font-semibold text-gray-800 mb-1">{consulta.nombre}</h4>
                <p className="text-sm text-gray-600">{consulta.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultasRapidas;