import Ai from '../assets/ai.png';

const HomeIA = () => {
  return (
    <section className="bg-gradient-to-br from-black via-gray-900 to-red-900 flex flex-col-reverse lg:flex-row items-center justify-between relative text-left py-16 md:py-24 px-6 lg:px-20">
      <div className="bg-black bg-opacity-60 p-8 rounded-2xl max-w-xl shadow-xl border border-white/10 backdrop-blur-sm">
        <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 text-white leading-tight text-red-400">
          ¡Acompaña tus entrenamientos con inteligencia artificial!
        </h2>
        <p className="text-lg text-gray-200 leading-relaxed">
          Bienvenida a tu seguidor de entrenamiento, donde podrás llevar un control de tus rutinas
        </p>
      </div>

      <div className='flex justify-center lg:justify-end max-w-md '>
        <img src={Ai} 
        alt="Entrenamiento con IA" 
        className="w-full max-w-md rounded-2xl shadow-lg object-cover shadow-2xl hover:scale-105 transition-transform duration-500 aspect-video lg:h-[22rem]" />
      </div>

    </section>
  );
};

export default HomeIA;