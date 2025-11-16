import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DashboardLayout from '../../layouts/DashboardLayout';

interface Usuario {
  id_usuario: number;
  correo: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  rol: 'deportista' | 'entrenador' | 'administrador';
  fechaRegistro: string;
}

interface Deportista {
  id_deportista: number;
  id_usuario: number;
  id_entrenador?: number | null;
  genero?: string | null;
  fechaNacimiento?: string | null;
  peso: number;
  altura: number;
  usuario?: Usuario;
}

interface Entrenador {
  id_entrenador: number;
  id_usuario: number;
  id_experiencia?: number;
  usuario?: Usuario;
}

interface NuevoDeportistaForm {
  id_usuario: number;
  id_entrenador?: number | null;
  genero: string;
  fechaNacimiento: string;
  peso: number;
  altura: number;
}

const UsuarioList = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  
  // Estados para la sección de asignación
  const [mostrarAsignacion, setMostrarAsignacion] = useState(false);
  const [entrenadorSeleccionado, setEntrenadorSeleccionado] = useState<number | null>(null);
  const [deportistasSeleccionados, setDeportistasSeleccionados] = useState<number[]>([]);
  const [asignando, setAsignando] = useState(false);

  // Estados para el formulario de datos adicionales
  const [mostrarFormularioDatos, setMostrarFormularioDatos] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [formDatos, setFormDatos] = useState<NuevoDeportistaForm>({
    id_usuario: 0,
    id_entrenador: null,
    genero: '',
    fechaNacimiento: '',
    peso: 0,
    altura: 0
  });

  // Cargar usuarios REALES desde el backend
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/usuarios');
      console.log('Usuarios cargados desde BD:', response.data);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      toast.error('Error al cargar los usuarios');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar deportistas existentes desde el backend
  const cargarDeportistasExistentes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/deportistas');
      console.log('Deportistas cargados desde BD:', response.data);
      setDeportistas(response.data);
    } catch (error) {
      console.error('Error cargando deportistas:', error);
      toast.error('Error al cargar los deportistas');
      setDeportistas([]);
    }
  };

  // Cargar entrenadores desde los usuarios
  const cargarEntrenadores = () => {
    const usuariosEntrenadores = usuarios.filter(u => u.rol === 'entrenador');
    const entrenadoresData: Entrenador[] = usuariosEntrenadores.map(usuario => ({
      id_entrenador: usuario.id_usuario,
      id_usuario: usuario.id_usuario,
      usuario: usuario
    }));
    setEntrenadores(entrenadoresData);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      await cargarUsuarios();
      await cargarDeportistasExistentes();
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (usuarios.length > 0) {
      cargarEntrenadores();
    }
  }, [usuarios]);

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    const nombreCompleto = `${usuario.primerNombre} ${usuario.segundoNombre || ''} ${usuario.primerApellido} ${usuario.segundoApellido || ''}`.toLowerCase();
    const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase()) || 
                           usuario.correo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = filtroTipo === 'todos' || usuario.rol === filtroTipo;
    
    return coincideBusqueda && coincideTipo;
  });

  const handleEliminarUsuario = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      setDeletingId(id);
      await axios.delete(`http://localhost:3000/usuarios/${id}`);
      toast.success('Usuario eliminado exitosamente');
      cargarUsuarios();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      toast.error('Error al eliminar el usuario');
    } finally {
      setDeletingId(null);
    }
  };

  // Funciones para la asignación de deportistas
  const handleSeleccionarDeportista = (idDeportista: number) => {
    setDeportistasSeleccionados(prev => 
      prev.includes(idDeportista) 
        ? prev.filter(id => id !== idDeportista)
        : [...prev, idDeportista]
    );
  };

  const handleAsignarDeportistas = async () => {
    if (!entrenadorSeleccionado || deportistasSeleccionados.length === 0) {
      toast.error('Selecciona un entrenador y al menos un deportista');
      return;
    }

    try {
      setAsignando(true);
      
      // Asignar cada deportista seleccionado al entrenador usando PUT
      for (const idDeportista of deportistasSeleccionados) {
        const deportista = deportistas.find(d => d.id_deportista === idDeportista);
        if (deportista) {
          try {
            // Usar PUT en lugar de PATCH para evitar problemas CORS
            await axios.put(`http://localhost:3000/deportistas/${idDeportista}`, {
              ...deportista, // Mantener todos los datos existentes
              id_entrenador: entrenadorSeleccionado // Solo cambiar el entrenador
            });
            console.log(`Deportista ${idDeportista} actualizado correctamente`);
          } catch (error) {
            console.error(`Error actualizando deportista ${idDeportista}:`, error);
            throw new Error(`No se pudo actualizar el deportista ${idDeportista}`);
          }
        }
      }

      toast.success(`Deportistas asignados exitosamente al entrenador`);
      
      // Recargar datos
      await cargarDeportistasExistentes();
      
      // Limpiar selección
      setDeportistasSeleccionados([]);
      setEntrenadorSeleccionado(null);
      setMostrarAsignacion(false);
      
    } catch (error) {
      console.error('Error asignando deportistas:', error);
      toast.error('Error al asignar los deportistas');
    } finally {
      setAsignando(false);
    }
  };

  // Funciones para el formulario de datos adicionales
  const handleCompletarDatosDeportista = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    
    // Buscar si ya existe un deportista para este usuario
    const deportistaExistente = deportistas.find(d => d.id_usuario === usuario.id_usuario);
    
    setFormDatos({
      id_usuario: usuario.id_usuario,
      id_entrenador: deportistaExistente?.id_entrenador || null,
      genero: deportistaExistente?.genero || '',
      fechaNacimiento: deportistaExistente?.fechaNacimiento || '',
      peso: deportistaExistente?.peso || 0,
      altura: deportistaExistente?.altura || 0
    });
    
    setMostrarFormularioDatos(true);
  };

  const handleSubmitDatosDeportista = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formDatos.peso || formDatos.peso <= 0 || !formDatos.altura || formDatos.altura <= 0) {
      toast.error('Peso y altura son obligatorios y deben ser mayores a 0');
      return;
    }

    try {
      const deportistaData = {
        id_usuario: formDatos.id_usuario,
        id_entrenador: formDatos.id_entrenador,
        genero: formDatos.genero || null,
        fechaNacimiento: formDatos.fechaNacimiento || null,
        peso: formDatos.peso,
        altura: formDatos.altura
      };

      console.log('Enviando datos de deportista:', deportistaData);

      // Verificar si el deportista ya existe
      const deportistaExistente = deportistas.find(d => d.id_usuario === formDatos.id_usuario);
      
      let response;
      if (deportistaExistente) {
        // Actualizar deportista existente
        response = await axios.put(`http://localhost:3000/deportistas/${deportistaExistente.id_deportista}`, deportistaData);
        console.log('Deportista actualizado:', response.data);
        toast.success('Datos de deportista actualizados exitosamente');
      } else {
        // Crear nuevo deportista
        response = await axios.post('http://localhost:3000/deportistas', deportistaData);
        console.log('Deportista creado:', response.data);
        toast.success('Datos de deportista guardados exitosamente');
      }
      
      setMostrarFormularioDatos(false);
      setUsuarioSeleccionado(null);
      
      // Recargar deportistas
      await cargarDeportistasExistentes();
      
    } catch (error: any) {
      console.error('Error guardando datos de deportista:', error);
      if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error('Error al guardar los datos del deportista');
      }
    }
  };

  const getNombreCompleto = (usuario: Usuario) => {
    return `${usuario.primerNombre} ${usuario.segundoNombre || ''} ${usuario.primerApellido} ${usuario.segundoApellido || ''}`.trim().replace(/\s+/g, ' ');
  };

  const getRolBadge = (rol: string) => {
    const colors = {
      deportista: 'bg-blue-100 text-blue-800 border border-blue-200',
      entrenador: 'bg-green-100 text-green-800 border border-green-200',
      administrador: 'bg-purple-100 text-purple-800 border border-purple-200'
    };
    return colors[rol as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRolDisplay = (rol: string) => {
    const roles: { [key: string]: string } = {
      deportista: 'Deportista',
      entrenador: 'Entrenador',
      administrador: 'Administrador'
    };
    return roles[rol] || rol;
  };

  // Obtener deportistas sin entrenador asignado
  const deportistasSinEntrenador = deportistas.filter(d => !d.id_entrenador);

  // Obtener usuarios que son deportistas pero no tienen registro en deportistas
  const usuariosDeportistasSinRegistro = usuarios.filter(usuario => 
    usuario.rol === 'deportista' && 
    !deportistas.some(d => d.id_usuario === usuario.id_usuario)
  );

  // Obtener entrenador seleccionado
  const entrenadorActual = entrenadores.find(e => e.id_entrenador === entrenadorSeleccionado);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Cargando usuarios...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setMostrarAsignacion(!mostrarAsignacion)}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition flex items-center gap-2"
            >
              <span>👥</span>
              <span>Asignar Deportistas</span>
            </button>
            <button
              onClick={() => navigate('/usuarios/crear')}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <span>+</span>
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>

        {/* Modal para completar datos de deportista */}
        {mostrarFormularioDatos && usuarioSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {deportistas.some(d => d.id_usuario === usuarioSeleccionado.id_usuario) 
                  ? 'Actualizar Datos de Deportista' 
                  : 'Completar Datos de Deportista'
                }
              </h2>
              <p className="text-gray-600 mb-4">
                {deportistas.some(d => d.id_usuario === usuarioSeleccionado.id_usuario)
                  ? 'Actualiza los datos para:'
                  : 'Completa los datos para:'
                } <strong>{getNombreCompleto(usuarioSeleccionado)}</strong>
              </p>
              
              <form onSubmit={handleSubmitDatosDeportista}>
                <div className="space-y-4">
                  {/* Género */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Género
                    </label>
                    <select
                      value={formDatos.genero}
                      onChange={(e) => setFormDatos({...formDatos, genero: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Seleccionar género</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      value={formDatos.fechaNacimiento}
                      onChange={(e) => setFormDatos({...formDatos, fechaNacimiento: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Peso */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Peso (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formDatos.peso || ''}
                      onChange={(e) => setFormDatos({...formDatos, peso: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  {/* Altura */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Altura (cm) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formDatos.altura || ''}
                      onChange={(e) => setFormDatos({...formDatos, altura: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  {/* Entrenador Asignado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entrenador Asignado (Opcional)
                    </label>
                    <select
                      value={formDatos.id_entrenador || ''}
                      onChange={(e) => setFormDatos({...formDatos, id_entrenador: e.target.value ? Number(e.target.value) : null})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Sin entrenador asignado</option>
                      {entrenadores.map(entrenador => (
                        <option key={entrenador.id_entrenador} value={entrenador.id_entrenador}>
                          {entrenador.usuario ? getNombreCompleto(entrenador.usuario) : `Entrenador ${entrenador.id_entrenador}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    {deportistas.some(d => d.id_usuario === usuarioSeleccionado.id_usuario)
                      ? 'Actualizar Datos'
                      : 'Guardar Datos'
                    }
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarFormularioDatos(false);
                      setUsuarioSeleccionado(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sección de Asignación de Deportistas */}
        {mostrarAsignacion && (
          <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Asignar Deportistas a Entrenador</h2>
            
            {/* Selección de Entrenador */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Entrenador
              </label>
              <select
                value={entrenadorSeleccionado || ''}
                onChange={(e) => setEntrenadorSeleccionado(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Selecciona un entrenador</option>
                {entrenadores.map(entrenador => (
                  <option key={entrenador.id_entrenador} value={entrenador.id_entrenador}>
                    {entrenador.usuario ? getNombreCompleto(entrenador.usuario) : `Entrenador ${entrenador.id_entrenador}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Entrenador seleccionado */}
            {entrenadorActual && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Entrenador seleccionado:</strong> {entrenadorActual.usuario && getNombreCompleto(entrenadorActual.usuario)}
                </p>
              </div>
            )}

            {/* Lista de Deportistas Disponibles */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deportistas sin entrenador asignado ({deportistasSinEntrenador.length})
              </label>
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                {deportistasSinEntrenador.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No hay deportistas sin entrenador asignado
                  </div>
                ) : (
                  deportistasSinEntrenador.map(deportista => (
                    <div key={deportista.id_deportista} className="flex items-center p-3 border-b border-gray-200 hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={deportistasSeleccionados.includes(deportista.id_deportista)}
                        onChange={() => handleSeleccionarDeportista(deportista.id_deportista)}
                        className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {deportista.usuario ? getNombreCompleto(deportista.usuario) : `Deportista ${deportista.id_deportista}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {deportista.id_deportista} | 
                          Peso: {deportista.peso || 'No definido'}kg | 
                          Altura: {deportista.altura || 'No definida'}cm
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2">
              <button
                onClick={handleAsignarDeportistas}
                disabled={!entrenadorSeleccionado || deportistasSeleccionados.length === 0 || asignando}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {asignando ? 'Asignando...' : `Asignar ${deportistasSeleccionados.length} deportista(s)`}
              </button>
              <button
                onClick={() => {
                  setMostrarAsignacion(false);
                  setEntrenadorSeleccionado(null);
                  setDeportistasSeleccionados([]);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Alert para usuarios deportistas sin datos completos */}
        {usuariosDeportistasSinRegistro.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-yellow-600 mr-3">⚠️</div>
              <div>
                <h3 className="text-sm font-semibold text-yellow-800">
                  {usuariosDeportistasSinRegistro.length} deportista(s) necesita(n) datos adicionales
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Los siguientes usuarios tienen rol de deportista pero no tienen registro en la base de datos.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {usuariosDeportistasSinRegistro.map(usuario => (
                    <button
                      key={usuario.id_usuario}
                      onClick={() => handleCompletarDatosDeportista(usuario)}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded hover:bg-yellow-200 transition border border-yellow-300"
                    >
                      {getNombreCompleto(usuario)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros y búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por nombre o email
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por tipo
            </label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="todos">Todos los tipos</option>
              <option value="deportista">Deportista</option>
              <option value="entrenador">Entrenador</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-gray-600 font-semibold">Total</div>
            <div className="text-2xl font-bold text-gray-700">{usuarios.length}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-blue-600 font-semibold">Deportistas</div>
            <div className="text-2xl font-bold text-blue-700">
              {usuarios.filter(u => u.rol === 'deportista').length}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-green-600 font-semibold">Entrenadores</div>
            <div className="text-2xl font-bold text-green-700">
              {usuarios.filter(u => u.rol === 'entrenador').length}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-purple-600 font-semibold">Administradores</div>
            <div className="text-2xl font-bold text-purple-700">
              {usuarios.filter(u => u.rol === 'administrador').length}
            </div>
          </div>
        </div>

        {/* Tabla de usuarios REALES */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => {
                const esDeportista = usuario.rol === 'deportista';
                const deportista = deportistas.find(d => d.id_usuario === usuario.id_usuario);
                const tieneRegistro = !!deportista;
                const tieneDatosCompletos = deportista && deportista.peso > 0 && deportista.altura > 0;
                
                return (
                  <tr key={usuario.id_usuario} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{usuario.id_usuario}</div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      <div className="text-sm font-medium text-gray-900">
                        {getNombreCompleto(usuario)}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      <div className="text-sm text-gray-900">{usuario.correo}</div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRolBadge(usuario.rol)}`}>
                        {getRolDisplay(usuario.rol)}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      {esDeportista && (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          !tieneRegistro 
                            ? 'bg-red-100 text-red-800'
                            : tieneDatosCompletos 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {!tieneRegistro ? 'Sin Registro' : 
                           tieneDatosCompletos ? 'Datos Completos' : 'Datos Incompletos'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      <div className="flex space-x-2">
                        {/* Acción VER */}
                        <button
                          onClick={() => navigate(`/usuarios/ver/${usuario.id_usuario}`)}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
                        >
                          Ver
                        </button>
                        {/* Acción EDITAR */}
                        <button
                          onClick={() => navigate(`/usuarios/editar/${usuario.id_usuario}`)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                        >
                          Editar
                        </button>
                        {/* Acción COMPLETAR DATOS para deportistas */}
                        {esDeportista && (
                          <button
                            onClick={() => handleCompletarDatosDeportista(usuario)}
                            className={`px-3 py-1 text-white text-sm rounded transition ${
                              !tieneRegistro 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : tieneDatosCompletos 
                                ? 'bg-orange-500 hover:bg-orange-600' 
                                : 'bg-yellow-500 hover:bg-yellow-600'
                            }`}
                          >
                            {!tieneRegistro ? 'Crear Registro' : 
                             tieneDatosCompletos ? 'Editar Datos' : 'Completar Datos'}
                          </button>
                        )}
                        {/* Acción ELIMINAR */}
                        <button
                          onClick={() => handleEliminarUsuario(usuario.id_usuario)}
                          disabled={deletingId === usuario.id_usuario}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition disabled:bg-red-300"
                        >
                          {deletingId === usuario.id_usuario ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {usuarios.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay usuarios registrados</h3>
            <p className="text-gray-500 mb-4">Comienza creando el primer usuario en el sistema</p>
            <button
              onClick={() => navigate('/usuarios/crear')}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Crear Primer Usuario
            </button>
          </div>
        )}

        {usuarios.length > 0 && usuariosFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron usuarios que coincidan con la búsqueda
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsuarioList;