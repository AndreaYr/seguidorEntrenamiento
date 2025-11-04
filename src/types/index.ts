// Tipos para Usuarios
export type TipoUsuario = 'deportista' | 'entrenador' | 'administrador';

export interface Usuario {
  id: string;
  email: string;
  username: string;
  nombres: string;
  apellidos: string;
  password: string;
  tipo: TipoUsuario;
  // Campos específicos por tipo
  edad?: number;
  genero?: 'masculino' | 'femenino' | 'otro';
  objetivosDeportivos?: string;
  certificaciones?: string;
  experiencia?: string;
  permisos?: string[];
}

// Tipos para Entrenamientos
export type Disciplina = 'ciclismo' | 'running' | 'natacion';

export interface Entrenamiento {
  id: string;
  disciplina: Disciplina;
  fecha: string;
  duracion: number; // minutos
  distancia: number; // km
  velocidadPromedio: number; // km/h
  caloriasQuemadas: number;
  frecuenciaCardiaca?: number;
  deportistaId: string;
}

// Tipos para Ejercicios
export type Intensidad = 'baja' | 'media' | 'alta';

export interface Ejercicio {
  id: string;
  nombre: string;
  intensidad: Intensidad;
  series: number;
  repeticiones: number;
  tiempo?: number; // segundos
  entrenamientoId: string;
  notas?: string;
}

// Tipos para Planes de Entrenamiento
export type EstadoPlan = 'activo' | 'completado' | 'pausado';

export interface PlanEntrenamiento {
  id: string;
  nombre: string;
  entrenadorId: string;
  deportistaIds: string[];
  fechaInicio: string;
  fechaFin: string;
  objetivo: string;
  estado: EstadoPlan;
  entrenamientoIds: string[];
}

// Tipos para Estadísticas/Reportes
export interface Estadisticas {
  id: string;
  deportistaId: string;
  periodoInicio: string;
  periodoFin: string;
  fechaGeneracion: string;
  metricas: {
    mejoraTiempos: number; // porcentaje
    incrementoResistencia: number; // porcentaje
    distanciaTotal: number; // km
    caloriasTotales: number;
    entrenamientosRealizados: number;
  };
}

// Tipos para Retos/Competencias
export type EstadoReto = 'activo' | 'finalizado' | 'proximo';

export interface Reto {
  id: string;
  nombre: string;
  descripcion: string;
  disciplina: Disciplina;
  fechaInicio: string;
  fechaFin: string;
  objetivo: string; // "Correr 100 km en 1 mes"
  estado: EstadoReto;
  participantes: Array<{
    deportistaId: string;
    progreso: number; // km, tiempo, etc.
    posicion: number;
  }>;
}


