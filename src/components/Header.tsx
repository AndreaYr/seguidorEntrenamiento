const Header = () => {
  return (
    <header className="flex bg-black justify-between items-center p-4 shadow-md">
        <h1 className="text-2xl font-bold text-white">Seguidor de entrenamiento</h1>
        <div className="space-x-4"> 
          <a href="/" className="text-white hover:text-[#E63946]">Inicio</a>
          <a href="/about" className="text-white hover:text-[#E63946]">Nosotros</a>
          <a href="/contact" className="text-white hover:text-[#E63946]">Acerca de</a>
          <a href="/blog" className="text-white hover:text-[#E63946]">Blog</a>
        </div>
        <div className="flex items-center space-x-4 pr-8">
          <button className="px-4 py-2 bg-[#E63946] text-white rounded font-semibold hover:bg-[#b62734]">Iniciar Sesión</button>
          <button className="px-4 py-2 border bg-white text-[#E63946] rounded font-semibold hover:bg-stone-400">Registrarse</button>
        </div>
    </header>
  );
}

export default Header;