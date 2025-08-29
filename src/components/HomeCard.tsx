import Card1 from '../assets/img1.jpg';
import Card2 from '../assets/gimnasio.jpg';
import Card3 from '../assets/boxeo.png';
import Card4 from '../assets/flexibilidad.jpg';
import Card5 from '../assets/crossfit.jpg';
import Card6 from '../assets/pole.jpg';
import { useState } from 'react';


const cards =[
  { 
    img: Card1,
    title: "Resistencia física",  
    description: "Mejora tu capacidad aeróbica y mantén un ritmo constante en tus entrenamientos prolongados.",
  },
  {
    img: Card2,
    title: "Rutina de gimnasio",
    description: "Entrena con peso y resistencia para aumentar masa muscular y fuerza fisica.",
  },
  {
    img: Card3,
    title: "Boxeo",
    description: "Desarrolla coordinacion, agilidad y potencia con rutinas intensas y tecnicas de combate.",  
  },
  {
    img: Card4,
    title: "Flexibilidad",
    description: "Aumenta el rango de movimiento de tus musculos con estiramientos y ejercicios suaves.",
  },
  {
    img: Card5,
    title: "Crossfit",
    description: "Entrena a alta intesidad con movimientos funcionales para mejorar tu condicion general",
  },
  {
    img: Card6,
    title: "Pole Dance",
    description: "Combina fuerza, equilibrio y arte con una disciplina que mejora todo tu cuerpo.",
  }

]

const HomeCard = () => {

  const [flippedCards, setFlippedCards] = useState(Array(cards.length).fill(false));

  const toggleFlip = (index: number) => {
    setFlippedCards(prev => {
      const newFlips = [...prev];
      newFlips[index] = !newFlips[index];
      return newFlips;
    });
  };

  return (
    <section className="bg-gradient-to-br from-black via-gray-900 to-red-950 relative bg-center text-left py-20 px-6">
      <div className='max-w-4xl mx-auto mb-16 text-center cursor-default'>
        <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-6">Información<span className='text-red-500'> de entrenamientos</span></h1>
        <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
          Explora los diferentes tipos de entrenamiento que puedes registrar en tu aplicación. Cada disciplina te impulsa hacia tus objetivos de forma única.
        </p>
      </div>

        {/*Tarjetas*/}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto cursor-pointer'>
          {cards.map((card, index) => (
            <div 
                role='button'
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleFlip(index)} 
                className='relative w-full h-80 hover:scale-105 [perspective:1000px] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 rounded-3xl'
                onClick={() => toggleFlip(index)}>

              <div className={`relative w-full h-full transform-gpu transition-transform duration-700 preserve-3d [transform-style:preserve-3d] ${flippedCards[index] ? '[transform:rotateY(180deg)]' : ''}`}>

                {/**Front */}
                <div className='card-front bg-white rounded-2xl absolute shadow-lg shadow-red-900/50 overflow-hidden'>
                  <img src={card.img} alt={card.title} className='w-full h-48 object-cover'/>
                  <div className='p-5'>
                    <h2 className='text-xl font-bold mb-2 text-gary-300'>{card.title}</h2>
                  </div>
                </div>

                {/**Back */}
                <div className='absolute inset-0 rounded-2xl text-white p-6 flex items-center justify-center border border-white text-center shadow-xl bg-gradient-to-t from-black via-black/40 to-transparent [transform:rotateY(180deg)] [backface-visibility:hidden]'>
                  <p className='text-gray-300 leading-relaxed'>{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
    </section>
  );
}

export default HomeCard;