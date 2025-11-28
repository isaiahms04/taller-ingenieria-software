import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./register.scss";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail]   = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]   = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await axios.post("http://localhost:8800/auth/register", {
        nombre,
        email,
        password,
      });

      if (data.success) {
        navigate("/login");
      }
    } catch (error) {
      setError("Ese correo ya está registrado");
    }
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleRegister}>
        <h2>Crear cuenta</h2>

        <label>Nombre</label>
        <input value={nombre} onChange={e=>setNombre(e.target.value)} required />

        <label>Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />

        <label>Contraseña</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />

        {error && <p className="error">{error}</p>}

        <button type="submit">Registrarse</button>

        <button type="button" className="btnReturn" onClick={()=>navigate("/login")}>
          Volver al inicio de sesión
        </button>
      </form>
    </div>
  );
};

export default Register;
