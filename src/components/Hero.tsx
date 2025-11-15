import heroFondo from '../assets/hero.jpg';
import { useNavigate } from 'react-router-dom';

const Hero = () => {

  const navigate = useNavigate();

  return (
    <section className="relative bg-cover bg-center text-left py-44 px-10" style={{ backgroundImage: `url(${heroFondo})` }}>
      <div className="bg-black bg-opacity-60 p-8 rounded-lg max-w-xl">
        <h2 className="text-4xl font-bold mb-4 text-white">
          ¡Comienza tu entrenamiento!
        </h2>
        <p className="text-lg text-gray-200 mb-6">
          Bienvenida a tu seguidor de entrenamiento, donde podrás llevar un control de tus rutinas
        </p>
        <button onClick={() => navigate("/login")} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-500 transition">
          Empezar ahora
        </button>
      </div>
    </section>
  );
};

export default Hero;
