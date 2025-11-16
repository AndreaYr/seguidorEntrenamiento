import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ConsultasRapidas from './pages/consultasRapidas/consultasRapidas';

// Usuarios
import UsuariosList from './pages/usuarios/UsuariosList';
import UsuarioDetail from './pages/usuarios/UsuarioDetail';
import UsuarioCreate from './pages/usuarios/UsuarioCreate';
import UsuarioEdit from './pages/usuarios/UsuarioEdit';


// Entrenamientos
import EntrenamientosList from './pages/entrenamientos/EntrenamientosList';
import EntrenamientoDetail from './pages/entrenamientos/EntrenamientoDetail';
import EntrenamientoCreate from './pages/entrenamientos/EntrenamientoCreate';
import EntrenamientoEdit from './pages/entrenamientos/EntrenamientoEdit';
//import EntrenamientoDelete from './pages/entrenamientos/EntrenamientoDelete';

// Estadísticas
import EstadisticasList from './pages/estadisticas/EstadisticasList';
import EstadisticaDetail from './pages/estadisticas/EstadisticaDetail';
import EstadisticaCreate from './pages/estadisticas/EstadisticaCreate';
import EstadisticaDelete from './pages/estadisticas/EstadisticaDelete';

// Retos
import RetosList from './pages/retos/RetosList';
import RetoDetail from './pages/retos/RetoDetail';
import RetoCreate from './pages/retos/RetoCreate';
import RetoEdit from './pages/retos/RetoEdit';
import RetoDelete from './pages/retos/RetoDelete';
import { ToastContainer } from 'react-toastify';


function App() {
  

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Usuarios Routes */}
        <Route path="/usuarios" element={<UsuariosList />} />
        <Route path="/usuarios/crear" element={<UsuarioCreate />} />
        <Route path="/usuarios/editar/:id" element={<UsuarioEdit />} />
        <Route path="/usuarios/ver/:id" element={<UsuarioDetail />} />
        
        {/* Entrenamientos Routes */}
        <Route path="/entrenamientos" element={<EntrenamientosList />} />
        <Route path="/entrenamientos/crear" element={<EntrenamientoCreate />} />
        <Route path="/entrenamientos/editar/:id" element={<EntrenamientoEdit />} />
        <Route path="/entrenamientos/ver/:id" element={<EntrenamientoDetail />} />
              
        {/* Estadísticas Routes */}
        <Route path="/estadisticas" element={<EstadisticasList />} />
        <Route path="/estadisticas/crear" element={<EstadisticaCreate />} />
        <Route path="/estadisticas/:id" element={<EstadisticaDetail />} />
        <Route path="/estadisticas/eliminar/:id" element={<EstadisticaDelete />} />
        
        {/* Retos Routes */}
        <Route path="/retos" element={<RetosList />} />
        <Route path="/retos/crear" element={<RetoCreate />} />
        <Route path="/retos/:id" element={<RetoDetail />} />
        <Route path="/retos/editar/:id" element={<RetoEdit />} />
        <Route path="/retos/eliminar/:id" element={<RetoDelete />} />

        {/* Consultas Rápidas Routes */}
        <Route path="/consultas" element={<ConsultasRapidas />} />
      </Routes>
    
    </Router>
  );
}

export default App;
