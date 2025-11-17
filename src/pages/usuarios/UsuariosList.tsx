/* eslint-disable @typescript-eslint/no-explicit-any */
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
  experiencia?: string | null;
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

interface EntrenadorForm {
  id_usuario: number;
  experiencia: string;
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
  
  // Estados para completar datos de entrenadores
  const [mostrarCompletarEntrenadores, setMostrarCompletarEntrenadores] = useState(false);
  const [entrenadorEditando, setEntrenadorEditando] = useState<EntrenadorForm | null>(null);
  const [guardandoEntrenador, setGuardandoEntrenador] = useState(false);

  // Estados para formularios inline de deportistas
  const [deportistasEditando, setDeportistasEditando] = useState<{[key: number]: NuevoDeportistaForm}>({});
  const [guardandoDeportista, setGuardandoDeportista] = useState<number | null>(null);

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
      
      // Inicializar formularios inline
      const forms: {[key: number]: NuevoDeportistaForm} = {};
      response.data.forEach((deportista: Deportista) => {
        forms[deportista.id_usuario] = {
          id_usuario: deportista.id_usuario,
          id_entrenador: deportista.id_entrenador || null,
          genero: deportista.genero || '',
          fechaNacimiento: deportista.fechaNacimiento || '',
          peso: deportista.peso || 0,
          altura: deportista.altura || 0
        };
      });
      setDeportistasEditando(forms);
    } catch (error) {
      console.error('Error cargando deportistas:', error);
      toast.error('Error al cargar los deportistas');
      setDeportistas([]);
    }
  };

  // Cargar entrenadores desde el backend
  const cargarEntrenadores = async () => {
    try {
      const response = await axios.get('http://localhost:3000/entrenadores');
      console.log('Entrenadores cargados desde BD:', response.data);
      setEntrenadores(response.data);
    } catch (error: any) {
      console.error('Error cargando entrenadores:', error);
      if (error.response?.status === 404) {
        console.log('Ruta de entrenadores no encontrada, inicializando array vacío');
      } else {
        toast.error('Error al cargar los entrenadores');
      }
      setEntrenadores([]);
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      await cargarUsuarios();
      await cargarDeportistasExistentes();
      await cargarEntrenadores();
    };
    cargarDatos();
  }, []);

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

  // Funciones para completar datos de entrenadores
  const handleCompletarDatosEntrenador = (usuario: Usuario) => {
    // Buscar si ya existe en la tabla entrenadores
    const entrenadorExistente = entrenadores.find(e => e.id_usuario === usuario.id_usuario);
    
    setEntrenadorEditando({
      id_usuario: usuario.id_usuario,
      experiencia: entrenadorExistente?.experiencia || ''
    });
  };

  const handleGuardarDatosEntrenador = async () => {
    if (!entrenadorEditando) return;

    try {
      setGuardandoEntrenador(true);
      
      const entrenadorData = {
        id_usuario: entrenadorEditando.id_usuario,
        experiencia: entrenadorEditando.experiencia
      };

      console.log('Guardando datos de entrenador:', entrenadorData);

      // Verificar si el entrenador ya existe
      const entrenadorExistente = entrenadores.find(e => e.id_usuario === entrenadorEditando.id_usuario);
      
      let response;
      if (entrenadorExistente) {
        // Actualizar entrenador existente
        response = await axios.put(`http://localhost:3000/entrenadores/${entrenadorExistente.id_entrenador}`, entrenadorData);
        console.log('Entrenador actualizado:', response.data);
        toast.success('Datos de entrenador actualizados exitosamente');
      } else {
        // Crear nuevo entrenador
        response = await axios.post('http://localhost:3000/entrenadores', entrenadorData);
        console.log('Entrenador creado:', response.data);
        toast.success('Datos de entrenador guardados exitosamente');
      }
      
      // Recargar entrenadores
      await cargarEntrenadores();
      setEntrenadorEditando(null);
      
    } catch (error: any) {
      console.error('Error guardando datos de entrenador:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data?.error) {
        toast.error(`Error: ${error.response.data.error}`);
      } else if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else if (error.response?.data?.errors) {
        // Manejar errores de validación
        const validationErrors = error.response.data.errors.map((err: any) => err.msg).join(', ');
        toast.error(`Error de validación: ${validationErrors}`);
      } else {
        toast.error('Error al guardar los datos del entrenador');
      }
    } finally {
      setGuardandoEntrenador(false);
    }
  };

  // Funciones para formularios inline de deportistas
  const handleCambioDatosDeportista = (idUsuario: number, campo: string, valor: any) => {
    setDeportistasEditando(prev => ({
      ...prev,
      [idUsuario]: {
        ...prev[idUsuario],
        [campo]: valor
      }
    }));
  };

  const handleGuardarDatosDeportista = async (idUsuario: number) => {
    const datos = deportistasEditando[idUsuario];
    
    if (!datos.peso || datos.peso <= 0 || !datos.altura || datos.altura <= 0) {
      toast.error('Peso y altura son obligatorios y deben ser mayores a 0');
      return;
    }

    try {
      setGuardandoDeportista(idUsuario);
      
      // Preparar datos sin id_usuario para actualizaciones
      const deportistaData = {
        id_entrenador: datos.id_entrenador,
        genero: datos.genero || null,
        fechaNacimiento: datos.fechaNacimiento || null,
        peso: datos.peso,
        altura: datos.altura
      };

      console.log('Enviando datos de deportista:', deportistaData);

      // Verificar si el deportista ya existe
      const deportistaExistente = deportistas.find(d => d.id_usuario === idUsuario);
      
      let response;
      if (deportistaExistente) {
        // Actualizar deportista existente - NO enviar id_usuario
        response = await axios.put(`http://localhost:3000/deportistas/${deportistaExistente.id_deportista}`, deportistaData);
        console.log('Deportista actualizado:', response.data);
        toast.success('Datos de deportista actualizados exitosamente');
      } else {
        // Crear nuevo deportista - SÍ enviar id_usuario
        const createData = {
          ...deportistaData,
          id_usuario: idUsuario  // Solo para creación
        };
        response = await axios.post('http://localhost:3000/deportistas', createData);
        console.log('Deportista creado:', response.data);
        toast.success('Datos de deportista guardados exitosamente');
      }
      
      // Recargar deportistas
      await cargarDeportistasExistentes();
      
    } catch (error: any) {
      console.error('Error guardando datos de deportista:', error);
      if (error.response?.data?.error) {
        toast.error(`Error: ${error.response.data.error}`);
      } else if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error('Error al guardar los datos del deportista');
      }
    } finally {
      setGuardandoDeportista(null);
    }
  };

  // Inicializar formulario para un nuevo deportista
  const inicializarFormularioDeportista = (usuario: Usuario) => {
    const deportistaExistente = deportistas.find(d => d.id_usuario === usuario.id_usuario);
    
    setDeportistasEditando(prev => ({
      ...prev,
      [usuario.id_usuario]: {
        id_usuario: usuario.id_usuario,
        id_entrenador: deportistaExistente?.id_entrenador || null,
        genero: deportistaExistente?.genero || '',
        fechaNacimiento: deportistaExistente?.fechaNacimiento || '',
        peso: deportistaExistente?.peso || 0,
        altura: deportistaExistente?.altura || 0
      }
    }));
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

  // Obtener usuarios que son entrenadores pero no tienen registro en entrenadores
  const usuariosEntrenadoresSinRegistro = usuarios.filter(usuario => 
    usuario.rol === 'entrenador' && 
    !entrenadores.some(e => e.id_usuario === usuario.id_usuario)
  );

  // Obtener entrenadores disponibles para deportistas (solo los que tienen datos completos)
  const entrenadoresDisponibles = entrenadores.filter(entrenador => 
    entrenador.experiencia && entrenador.experiencia.trim() !== ''
  );

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
              onClick={() => setMostrarCompletarEntrenadores(!mostrarCompletarEntrenadores)}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition flex items-center gap-2"
            >
              <span>🏋️</span>
              <span>Completar Datos Entrenadores</span>
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

        {/* Modal para completar datos de entrenador */}
        {entrenadorEditando && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Completar Datos de Entrenador
              </h2>
              
              <form onSubmit={(e) => { e.preventDefault(); handleGuardarDatosEntrenador(); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entrenador
                    </label>
                    <input
                      type="text"
                      value={getNombreCompleto(usuarios.find(u => u.id_usuario === entrenadorEditando.id_usuario)!)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experiencia *
                    </label>
                    <textarea
                      value={entrenadorEditando.experiencia}
                      onChange={(e) => setEntrenadorEditando({...entrenadorEditando, experiencia: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={4}
                      placeholder="Describe la experiencia del entrenador..."
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    type="submit"
                    disabled={guardandoEntrenador}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:bg-green-300"
                  >
                    {guardandoEntrenador ? 'Guardando...' : 'Guardar Datos'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntrenadorEditando(null)}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sección para completar datos de entrenadores */}
        {mostrarCompletarEntrenadores && (
          <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Completar Datos de Entrenadores</h2>
            
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-green-600 font-semibold">Entrenadores Registrados</div>
                <div className="text-2xl font-bold text-green-700">{entrenadores.length}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-blue-600 font-semibold">Con Datos Completos</div>
                <div className="text-2xl font-bold text-blue-700">
                  {entrenadores.filter(e => e.experiencia && e.experiencia.trim() !== '').length}
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-yellow-600 font-semibold">Sin Datos Completos</div>
                <div className="text-2xl font-bold text-yellow-700">
                  {usuariosEntrenadoresSinRegistro.length + entrenadores.filter(e => !e.experiencia || e.experiencia.trim() === '').length}
                </div>
              </div>
            </div>

            {/* Lista de entrenadores que necesitan datos */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entrenadores que necesitan datos ({usuariosEntrenadoresSinRegistro.length})
              </label>
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                {usuariosEntrenadoresSinRegistro.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Todos los entrenadores tienen datos completos
                  </div>
                ) : (
                  usuariosEntrenadoresSinRegistro.map(usuario => (
                    <div key={usuario.id_usuario} className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-100">
                      <div>
                        <div className="font-medium text-gray-900">
                          {getNombreCompleto(usuario)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Email: {usuario.correo}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCompletarDatosEntrenador(usuario)}
                        className="px-4 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition"
                      >
                        Completar Datos
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => setMostrarCompletarEntrenadores(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Cerrar
            </button>
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
                const esEntrenador = usuario.rol === 'entrenador';
                const deportista = deportistas.find(d => d.id_usuario === usuario.id_usuario);
                const entrenador = entrenadores.find(e => e.id_usuario === usuario.id_usuario);
                
                const tieneRegistroDeportista = !!deportista;
                const tieneDatosCompletosDeportista = deportista && deportista.peso > 0 && deportista.altura > 0;
                const tieneDatosCompletosEntrenador = entrenador && entrenador.experiencia && entrenador.experiencia.trim() !== '';
                
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
                          !tieneRegistroDeportista 
                            ? 'bg-red-100 text-red-800'
                            : tieneDatosCompletosDeportista 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {!tieneRegistroDeportista ? 'Sin Registro' : 
                           tieneDatosCompletosDeportista ? 'Datos Completos' : 'Datos Incompletos'}
                        </span>
                      )}
                      {esEntrenador && (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          !entrenador 
                            ? 'bg-red-100 text-red-800'
                            : tieneDatosCompletosEntrenador 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {!entrenador ? 'Sin Registro' : 
                           tieneDatosCompletosEntrenador ? 'Datos Completos' : 'Datos Incompletos'}
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

        {/* Sección de Formularios para Deportistas */}
        {usuariosFiltrados.some(u => u.rol === 'deportista') && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestión de Datos de Deportistas</h2>
            
            {/* Información sobre entrenadores disponibles */}
            {entrenadoresDisponibles.length === 0 && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  ⚠️ No hay entrenadores disponibles. Completa los datos de los entrenadores primero.
                </p>
              </div>
            )}

            {/* Cabecera de la tabla de deportistas */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Deportista
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Género
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fecha Nacimiento
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Peso (kg)
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Altura (cm)
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Entrenador
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados
                    .filter(usuario => usuario.rol === 'deportista')
                    .map((usuario) => {
                      const datos = deportistasEditando[usuario.id_usuario];
                      const deportistaExistente = deportistas.find(d => d.id_usuario === usuario.id_usuario);
                      
                      // Inicializar formulario si no existe
                      if (!datos) {
                        inicializarFormularioDeportista(usuario);
                        return null;
                      }

                      return (
                        <tr key={usuario.id_usuario} className="hover:bg-gray-50">
                          <td className="px-6 py-4 border-b border-gray-200">
                            <div className="text-sm font-medium text-gray-900">
                              {getNombreCompleto(usuario)}
                            </div>
                            <div className="text-xs text-gray-500">ID: {usuario.id_usuario}</div>
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200">
                            <select
                              value={datos.genero}
                              onChange={(e) => handleCambioDatosDeportista(usuario.id_usuario, 'genero', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            >
                              <option value="">Seleccionar</option>
                              <option value="masculino">Masculino</option>
                              <option value="femenino">Femenino</option>
                              <option value="otro">Otro</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200">
                            <input
                              type="date"
                              value={datos.fechaNacimiento}
                              onChange={(e) => handleCambioDatosDeportista(usuario.id_usuario, 'fechaNacimiento', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              value={datos.peso || ''}
                              onChange={(e) => handleCambioDatosDeportista(usuario.id_usuario, 'peso', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                              placeholder="Peso en kg"
                            />
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              value={datos.altura || ''}
                              onChange={(e) => handleCambioDatosDeportista(usuario.id_usuario, 'altura', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                              placeholder="Altura en cm"
                            />
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200">
                            <select
                              value={datos.id_entrenador || ''}
                              onChange={(e) => handleCambioDatosDeportista(usuario.id_usuario, 'id_entrenador', e.target.value ? Number(e.target.value) : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                              disabled={entrenadoresDisponibles.length === 0}
                            >
                              <option value="">Sin entrenador</option>
                              {entrenadoresDisponibles.map(entrenador => (
                                <option key={entrenador.id_entrenador} value={entrenador.id_entrenador}>
                                  {entrenador.usuario ? getNombreCompleto(entrenador.usuario) : `Entrenador ${entrenador.id_entrenador}`}
                                </option>
                              ))}
                            </select>
                            {entrenadoresDisponibles.length === 0 && (
                              <p className="text-xs text-red-500 mt-1">
                                Complete datos de entrenadores primero
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200">
                            <button
                              onClick={() => handleGuardarDatosDeportista(usuario.id_usuario)}
                              disabled={guardandoDeportista === usuario.id_usuario}
                              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition disabled:bg-indigo-300 disabled:cursor-not-allowed"
                            >
                              {guardandoDeportista === usuario.id_usuario ? 'Guardando...' : 
                               deportistaExistente ? 'Actualizar' : 'Crear'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

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