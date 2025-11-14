import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/login", {
        correo: correo,
        contrasenia: contrasenia,
      });

      // Lo que devuelve tu backend:
      // {
      //   "token": "...",
      //   "usuario": { id_usuario, correo, rol, ... }
      // }

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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 text-sm rounded mb-4">
            {error}
          </div>
        )}

        <label className="block mb-2 text-sm font-medium">Correo</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full p-2 rounded border mb-4"
          required
        />

        <label className="block mb-2 text-sm font-medium">Contraseña</label>
        <input
          type="password"
          value={contrasenia}
          onChange={(e) => setContrasenia(e.target.value)}
          className="w-full p-2 rounded border mb-6"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;
