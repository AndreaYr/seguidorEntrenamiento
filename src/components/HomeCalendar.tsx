import Calendario from '../assets/calendario.png';

const HomeCalendar = () => {
    return (
      <section className="bg-gradient-to-br from-black via-gray-900 to-black relative bg-cover bg-center text-left py-16 md:py-24 px-6 lg:px-20">
        <div className="flex lg-flex-row items-center justify-between gap-10 lg:gap-16">

          <div className="bg-black/60 p-8 rounded-2xl mx-w-xl shadow-lg flex flex-col justify-center">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 text-white leading-tight">
              ¡Planifica hoy, <span className='text-red-400'> supera tus límites</span> mañana!
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Lleva el control de tus entrenamientos con nuestro calendario. Agenda rutinas, 
              visualiza tus sesiones y mantén tu progreso siempre a la vista.</p>
          </div>

          <img src={Calendario} alt="Calendario de entrenamiento" className="w-full max-w-md rounded-2xl shadow-lg object-cover border border-white/10 hover:scale-105 transition-transform duration-500" />'
        </div>
      </section>
    );
};

export default HomeCalendar;