/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/login", {
        correo: correo,
        contrasenia: contrasenia,
      });

      const { token, usuario } = response.data;

      // Guardar sesión
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("UserId", usuario.id_usuario);
      sessionStorage.setItem("UserEmail", usuario.correo);
      sessionStorage.setItem("UserRol", usuario.rol);
      sessionStorage.setItem("UserName", usuario.primerNombre);

      // Redirigir según rol
      if (usuario.rol === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al iniciar sesión";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 p-4">
      {/* Efectos de fondo con efecto agua/glass */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Efectos de onda de agua */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-200/20 via-transparent to-transparent"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Tarjeta de login - Efecto vidrio/agua */}
        <div className="bg-white/95 backdrop-blur-md border border-white/60 rounded-3xl shadow-2xl shadow-indigo-200/50 overflow-hidden relative">
          {/* Efecto de reflejo de agua */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-indigo-100/30 pointer-events-none"></div>
          
          {/* Patrón sutil de ondas */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
               style={{
                 backgroundImage: `radial-gradient(circle at 25% 25%, #4f46e5 2px, transparent 2px),
                                  radial-gradient(circle at 75% 75%, #4f46e5 2px, transparent 2px)`,
                 backgroundSize: '50px 50px',
                 backgroundPosition: '0 0, 25px 25px'
               }}>
          </div>

          <div className="relative p-8 z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido</h2>
              <p className="text-gray-600 text-sm">Ingresa a tu cuenta para continuar</p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm flex items-center space-x-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Campo Correo */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <span>Correo electrónico</span>
                </label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="tu@correo.com"
                  required
                />
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Contraseña</span>
                </label>
                <input
                  type="password"
                  value={contrasenia}
                  onChange={(e) => setContrasenia(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:from-indigo-300 disabled:to-indigo-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Ingresar</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Enlaces adicionales */}
            <div className="mt-6 text-center">
              <a href="#" className="text-indigo-600 hover:text-indigo-700 text-sm transition-colors duration-200 inline-flex items-center space-x-1">
                <span>¿Olvidaste tu contraseña?</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Footer de la tarjeta */}
          <div className="relative bg-gray-50/80 border-t border-gray-200/60 px-8 py-4 z-10">
            <p className="text-gray-600 text-xs text-center">
              ¿No tienes una cuenta?{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200">
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>

        {/* Texto decorativo inferior */}
        <div className="text-center mt-6">
          <p className="text-black-500 text-sm">
            Tu progreso comienza hoy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;