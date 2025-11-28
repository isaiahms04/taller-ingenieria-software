import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import './login.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data?.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // 🔹 NUEVO: redirección según rol
        if (data.user?.role === 'admin') {
          navigate('/');
        } else {
          navigate('/inscripciones');
        }
      } else {
        setErr('Credenciales inválidas');
      }
    } catch (e) {
      setErr('Credenciales inválidas');
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={onSubmit}>
        <h2>Iniciar sesión</h2>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          required
        />
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          required
        />
        {err && <p className="error">{err}</p>}

        <button type="submit">Entrar</button>

        <div className="register-link">
          <span>¿No tienes cuenta?</span>
          <button
            type="button"
            className="btnRegister"
            onClick={() => navigate("/register")}
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
