# SportTrack - Sistema CRUD Completo

## 📋 Resumen de Implementación

Se ha implementado un sistema CRUD completo para la aplicación SportTrack con 6 módulos principales:

### Módulos Implementados

1. **👥 Gestión de Usuarios** (`/usuarios`)
   - Lista de usuarios con filtros por tipo
   - Crear, editar, ver detalles y eliminar usuarios
   - Tipos de usuario: Deportistas, Entrenadores, Administradores
   - Campos específicos según tipo de usuario

2. **🏃 Gestión de Entrenamientos** (`/entrenamientos`)
   - Lista de entrenamientos con filtros por disciplina
   - Crear, editar, ver detalles y eliminar entrenamientos
   - Disciplinas: Running, Ciclismo, Natación
   - Métricas: distancia, duración, calorías, frecuencia cardíaca

3. **💪 Gestión de Ejercicios** (`/ejercicios`)
   - Lista de ejercicios con filtros por intensidad
   - Crear, editar, ver detalles y eliminar ejercicios
   - Intensidades: Baja, Media, Alta
   - Campos: series, repeticiones, tiempo, notas

4. **📋 Gestión de Planes de Entrenamiento** (`/planes`)
   - Lista de planes con filtros por estado
   - Crear, editar, ver detalles y eliminar planes
   - Estados: Activo, Completado, Pausado
   - Asignación de múltiples deportistas y entrenamientos

5. **📊 Gestión de Estadísticas** (`/estadisticas`)
   - Visualización de reportes de rendimiento
   - Generar nuevos reportes
   - Ver detalles y eliminar reportes
   - Métricas: mejora de tiempos, resistencia, distancias, calorías

6. **🏆 Gestión de Retos** (`/retos`)
   - Lista de retos con filtros por estado
   - Crear, editar, ver detalles y eliminar retos
   - Estados: Activo, Finalizado, Próximo
   - Clasificación y ranking de participantes

## 🎨 Características de Diseño

- **Layout Responsive**: Diseño adaptativo con Tailwind CSS
- **Sidebar de Navegación**: Menú lateral fijo para acceso rápido
- **Dashboard Principal**: Vista general con tarjetas visuales
- **Filtros y Búsqueda**: Funcionalidad de búsqueda en todas las listas
- **Formularios Validados**: Validación básica en todos los formularios
- **Confirmación de Eliminación**: Diálogos de confirmación antes de eliminar
- **Navegación Intuitiva**: Breadcrumbs y botones claros

## 🗂️ Estructura de Archivos

```
src/
├── types/
│   └── index.ts                    # Tipos TypeScript para todas las entidades
├── data/
│   └── mockData.ts                 # Datos hardcoded de prueba
├── layouts/
│   └── DashboardLayout.tsx         # Layout con sidebar de navegación
├── pages/
│   ├── Home.tsx                    # Página principal
│   ├── Dashboard.tsx               # Dashboard de administración
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── usuarios/
│   │   ├── UsuariosList.tsx
│   │   ├── UsuarioDetail.tsx
│   │   ├── UsuarioCreate.tsx
│   │   ├── UsuarioEdit.tsx
│   │   └── UsuarioDelete.tsx
│   ├── entrenamientos/
│   │   ├── EntrenamientosList.tsx
│   │   ├── EntrenamientoDetail.tsx
│   │   ├── EntrenamientoCreate.tsx
│   │   ├── EntrenamientoEdit.tsx
│   │   └── EntrenamientoDelete.tsx
│   ├── ejercicios/
│   │   ├── EjerciciosList.tsx
│   │   ├── EjercicioDetail.tsx
│   │   ├── EjercicioCreate.tsx
│   │   ├── EjercicioEdit.tsx
│   │   └── EjercicioDelete.tsx
│   ├── planes/
│   │   ├── PlanesList.tsx
│   │   ├── PlanDetail.tsx
│   │   ├── PlanCreate.tsx
│   │   ├── PlanEdit.tsx
│   │   └── PlanDelete.tsx
│   ├── estadisticas/
│   │   ├── EstadisticasList.tsx
│   │   ├── EstadisticaDetail.tsx
│   │   ├── EstadisticaCreate.tsx
│   │   └── EstadisticaDelete.tsx
│   └── retos/
│       ├── RetosList.tsx
│       ├── RetoDetail.tsx
│       ├── RetoCreate.tsx
│       ├── RetoEdit.tsx
│       └── RetoDelete.tsx
└── App.tsx                         # Rutas principales

```

## 🚀 Cómo Usar

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

### Acceso a los Módulos

1. Ir a la página principal: `http://localhost:5173/`
2. Hacer clic en "Dashboard" en el menú superior
3. Elegir el módulo CRUD desde las tarjetas o el menú lateral

### Rutas Principales

- `/` - Página de inicio
- `/dashboard` - Panel de administración
- `/usuarios` - Gestión de usuarios
- `/entrenamientos` - Gestión de entrenamientos
- `/ejercicios` - Gestión de ejercicios
- `/planes` - Gestión de planes
- `/estadisticas` - Gestión de estadísticas
- `/retos` - Gestión de retos

## 📊 Datos de Prueba

Todos los módulos incluyen datos de prueba hardcoded:

- **6 Usuarios**: 3 deportistas, 2 entrenadores, 1 administrador
- **6 Entrenamientos**: Varias disciplinas y fechas
- **6 Ejercicios**: Diferentes intensidades y tipos
- **3 Planes**: Estados y asignaciones variadas
- **3 Estadísticas**: Reportes de rendimiento
- **3 Retos**: Estados y participantes diversos

## 🔧 Tecnologías Utilizadas

- **React 19**: Framework de interfaz de usuario
- **TypeScript**: Tipado estático
- **React Router DOM 7**: Navegación y rutas
- **Tailwind CSS**: Estilos y diseño responsive
- **Vite**: Herramientas de desarrollo y build

## ⚙️ Funcionalidades Implementadas

✅ CRUD completo para 6 módulos
✅ Navegación integrada con sidebar
✅ Datos hardcoded realistas
✅ Filtros y búsqueda
✅ Validación de formularios
✅ Confirmación de eliminación
✅ Diseño responsive
✅ Tipado TypeScript
✅ Sin errores de linter

## 📝 Notas Importantes

- No se implementó conexión a base de datos real
- Todos los datos son hardcoded en `mockData.ts`
- Las operaciones de guardar/eliminar muestran alertas pero no persisten cambios
- Los formularios están validados pero las ediciones no se guardan
- El diseño es consistente con el estilo deportivo de la aplicación original

## 🎯 Próximos Pasos Sugeridos

1. Conectar con API backend
2. Implementar autenticación y autorización
3. Agregar gráficas reales para estadísticas
4. Implementar paginación para listas grandes
5. Agregar exportación de reportes (PDF, Excel)
6. Implementar búsqueda avanzada
7. Agregar filtros combinados


