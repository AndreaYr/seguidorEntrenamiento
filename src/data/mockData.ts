import type { Usuario, Entrenamiento, Ejercicio, PlanEntrenamiento, Estadisticas, Reto } from '../types';

// Usuarios de prueba
export const mockUsuarios: Usuario[] = [
  {
    id: '1',
    email: 'maria.garcia@email.com',
    username: 'maria_deportista',
    nombres: 'María',
    apellidos: 'García',
    password: 'password123',
    tipo: 'deportista',
    edad: 28,
    genero: 'femenino',
    objetivosDeportivos: 'Perder peso y mejorar resistencia cardiovascular'
  },
  {
    id: '2',
    email: 'carlos.martinez@email.com',
    username: 'carlos_entrenador',
    nombres: 'Carlos',
    apellidos: 'Martínez',
    password: 'password123',
    tipo: 'entrenador',
    certificaciones: 'Certificado Nacional de Entrenamiento Deportivo, Especialización en Running',
    experiencia: '5 años entrenando atletas de alto rendimiento'
  },
  {
    id: '3',
    email: 'admin@sporttrack.com',
    username: 'admin',
    nombres: 'Administrador',
    apellidos: 'Sistema',
    password: 'admin123',
    tipo: 'administrador',
    permisos: ['gestionar_usuarios', 'ver_reportes', 'configurar_sistema']
  },
  {
    id: '4',
    email: 'juan.lopez@email.com',
    username: 'juan_deportista',
    nombres: 'Juan',
    apellidos: 'López',
    password: 'password123',
    tipo: 'deportista',
    edad: 32,
    genero: 'masculino',
    objetivosDeportivos: 'Participar en maratón de Madrid'
  },
  {
    id: '5',
    email: 'ana.rodriguez@email.com',
    username: 'ana_entrenadora',
    nombres: 'Ana',
    apellidos: 'Rodríguez',
    password: 'password123',
    tipo: 'entrenador',
    certificaciones: 'Certificado Internacional de Ciclismo, Entrenamiento Funcional',
    experiencia: '8 años en entrenamiento deportivo y preparación física'
  },
  {
    id: '6',
    email: 'luis.hernandez@email.com',
    username: 'luis_deportista',
    nombres: 'Luis',
    apellidos: 'Hernández',
    password: 'password123',
    tipo: 'deportista',
    edad: 25,
    genero: 'masculino',
    objetivosDeportivos: 'Aumentar masa muscular y fuerza'
  }
];

// Entrenamientos de prueba
export const mockEntrenamientos: Entrenamiento[] = [
  {
    id: '1',
    disciplina: 'running',
    fecha: '2024-01-15',
    duracion: 45,
    distancia: 8.5,
    velocidadPromedio: 11.3,
    caloriasQuemadas: 520,
    frecuenciaCardiaca: 145,
    deportistaId: '1'
  },
  {
    id: '2',
    disciplina: 'ciclismo',
    fecha: '2024-01-16',
    duracion: 120,
    distancia: 45.2,
    velocidadPromedio: 22.6,
    caloriasQuemadas: 850,
    frecuenciaCardiaca: 135,
    deportistaId: '1'
  },
  {
    id: '3',
    disciplina: 'natacion',
    fecha: '2024-01-17',
    duracion: 60,
    distancia: 2.0,
    velocidadPromedio: 2.0,
    caloriasQuemadas: 450,
    frecuenciaCardiaca: 125,
    deportistaId: '4'
  },
  {
    id: '4',
    disciplina: 'running',
    fecha: '2024-01-18',
    duracion: 35,
    distancia: 6.2,
    velocidadPromedio: 10.6,
    caloriasQuemadas: 380,
    frecuenciaCardiaca: 140,
    deportistaId: '1'
  },
  {
    id: '5',
    disciplina: 'ciclismo',
    fecha: '2024-01-19',
    duracion: 90,
    distancia: 35.8,
    velocidadPromedio: 23.9,
    caloriasQuemadas: 720,
    frecuenciaCardiaca: 138,
    deportistaId: '4'
  },
  {
    id: '6',
    disciplina: 'running',
    fecha: '2024-01-20',
    duracion: 55,
    distancia: 10.2,
    velocidadPromedio: 11.1,
    caloriasQuemadas: 610,
    frecuenciaCardiaca: 150,
    deportistaId: '6'
  }
];

// Ejercicios de prueba
export const mockEjercicios: Ejercicio[] = [
  {
    id: '1',
    nombre: 'Calentamiento',
    intensidad: 'baja',
    series: 1,
    repeticiones: 10,
    tiempo: 300,
    entrenamientoId: '1',
    notas: 'Trote suave y estiramiento dinámico'
  },
  {
    id: '2',
    nombre: 'Intervalos rápidos',
    intensidad: 'alta',
    series: 6,
    repeticiones: 1,
    tiempo: 1200,
    entrenamientoId: '1',
    notas: '1 min rápido, 2 min recuperación'
  },
  {
    id: '3',
    nombre: 'Vuelta a la calma',
    intensidad: 'baja',
    series: 1,
    repeticiones: 1,
    tiempo: 600,
    entrenamientoId: '1',
    notas: 'Estiramiento y relajación'
  },
  {
    id: '4',
    nombre: 'Subida de montaña',
    intensidad: 'alta',
    series: 3,
    repeticiones: 1,
    tiempo: 900,
    entrenamientoId: '2',
    notas: 'Esfuerzo máximo en subidas'
  },
  {
    id: '5',
    nombre: 'Resistencia base',
    intensidad: 'media',
    series: 1,
    repeticiones: 1,
    tiempo: 3600,
    entrenamientoId: '2',
    notas: 'Ritmo constante moderado'
  },
  {
    id: '6',
    nombre: 'Estilos variados',
    intensidad: 'media',
    series: 4,
    repeticiones: 100,
    entrenamientoId: '3',
    notas: 'Crol, braza, espalda'
  }
];

// Planes de entrenamiento de prueba
export const mockPlanes: PlanEntrenamiento[] = [
  {
    id: '1',
    nombre: 'Plan de Maratón - Principiante',
    entrenadorId: '2',
    deportistaIds: ['1', '6'],
    fechaInicio: '2024-01-01',
    fechaFin: '2024-03-31',
    objetivo: 'Completar maratón en menos de 4 horas',
    estado: 'activo',
    entrenamientoIds: ['1', '4', '6']
  },
  {
    id: '2',
    nombre: 'Triatlón Sprint - Avanzado',
    entrenadorId: '5',
    deportistaIds: ['4'],
    fechaInicio: '2024-02-01',
    fechaFin: '2024-05-31',
    objetivo: 'Competir en triatlón sprint de verano',
    estado: 'activo',
    entrenamientoIds: ['2', '3', '5']
  },
  {
    id: '3',
    nombre: 'Preparación Ciclismo de Montaña',
    entrenadorId: '5',
    deportistaIds: ['1'],
    fechaInicio: '2023-11-01',
    fechaFin: '2024-01-31',
    objetivo: 'Preparación para carrera de montaña',
    estado: 'completado',
    entrenamientoIds: ['2', '5']
  }
];

// Estadísticas de prueba
export const mockEstadisticas: Estadisticas[] = [
  {
    id: '1',
    deportistaId: '1',
    periodoInicio: '2024-01-01',
    periodoFin: '2024-01-31',
    fechaGeneracion: '2024-02-01',
    metricas: {
      mejoraTiempos: 12.5,
      incrementoResistencia: 18.3,
      distanciaTotal: 156.8,
      caloriasTotales: 8750,
      entrenamientosRealizados: 20
    }
  },
  {
    id: '2',
    deportistaId: '4',
    periodoInicio: '2024-01-01',
    periodoFin: '2024-01-31',
    fechaGeneracion: '2024-02-01',
    metricas: {
      mejoraTiempos: 8.2,
      incrementoResistencia: 14.7,
      distanciaTotal: 284.5,
      caloriasTotales: 12500,
      entrenamientosRealizados: 25
    }
  },
  {
    id: '3',
    deportistaId: '6',
    periodoInicio: '2024-01-15',
    periodoFin: '2024-02-15',
    fechaGeneracion: '2024-02-16',
    metricas: {
      mejoraTiempos: 15.8,
      incrementoResistencia: 22.1,
      distanciaTotal: 98.3,
      caloriasTotales: 5400,
      entrenamientosRealizados: 15
    }
  }
];

// Retos de prueba
export const mockRetos: Reto[] = [
  {
    id: '1',
    nombre: 'Desafío Maratón Enero',
    descripcion: 'Completa 100 km corriendo durante el mes de enero',
    disciplina: 'running',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-01-31',
    objetivo: 'Correr 100 km en 1 mes',
    estado: 'finalizado',
    participantes: [
      { deportistaId: '1', progreso: 102.5, posicion: 1 },
      { deportistaId: '6', progreso: 85.3, posicion: 2 },
      { deportistaId: '4', progreso: 78.9, posicion: 3 }
    ]
  },
  {
    id: '2',
    nombre: 'Reto Ciclismo de Febrero',
    descripcion: 'Recorre 500 km en bicicleta este mes',
    disciplina: 'ciclismo',
    fechaInicio: '2024-02-01',
    fechaFin: '2024-02-29',
    objetivo: 'Ciclar 500 km en febrero',
    estado: 'activo',
    participantes: [
      { deportistaId: '4', progreso: 234.5, posicion: 1 },
      { deportistaId: '1', progreso: 189.2, posicion: 2 },
      { deportistaId: '6', progreso: 156.8, posicion: 3 }
    ]
  },
  {
    id: '3',
    nombre: 'Natación Rápida de Primavera',
    descripcion: 'Completa 20 km nadando en el mes de marzo',
    disciplina: 'natacion',
    fechaInicio: '2024-03-01',
    fechaFin: '2024-03-31',
    objetivo: 'Nadar 20 km en marzo',
    estado: 'proximo',
    participantes: []
  }
];


