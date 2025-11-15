import { useNavigate } from "react-router-dom";

const Header = () => {

  const navigate = useNavigate();

  return (
    <header className="flex bg-indigo-900 justify-between items-center p-4 shadow-md">
        <h1 className="text-2xl font-bold text-white">Seguidor de entrenamiento</h1>
        <div className="space-x-4"> 
          
        
        </div>
        <div className="flex items-center space-x-4 pr-8">
          <button onClick={() => navigate("/login")} className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-500">Iniciar Sesión</button>
          <button onClick={() => navigate("/register")} className="px-4 py-2 border bg-white text-black rounded font-semibold hover:bg-stone-400">Registrarse</button>
        </div>
    </header>
  );
}

export default Header;