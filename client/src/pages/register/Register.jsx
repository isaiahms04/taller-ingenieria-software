import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; // Ajusta la ruta según tu proyecto
import "./register.scss";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", {
        nombre,
        email,
        password,
      });

      if (data.success) {
        navigate("/login");
      } else {
        setError("No se pudo registrar, intenta nuevamente.");
      }
    } catch (err) {
      if (err?.response?.status === 409) {
        setError("Ese correo ya está registrado");
      } else {
        setError("Error al conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleRegister}>
        <h2>Crear cuenta</h2>

        <label>Nombre</label>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <button
          type="button"
          className="btnReturn"
          onClick={() => navigate("/login")}
          disabled={loading}
        >
          Volver al inicio de sesión
        </button>
      </form>
    </div>
  );
};

export default Register;
