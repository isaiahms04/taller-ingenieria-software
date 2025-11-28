import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import './login.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });

      if (data?.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirección según rol
        if (data.user?.role === 'admin') {
          navigate('/');
        } else {
          navigate('/inscripciones');
        }
      } else {
        setErr('Credenciales inválidas');
      }
    } catch (e) {
      setErr('Error al conectar con el servidor');
    } finally {
      setLoading(false);
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
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {err && <p className="error">{err}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Entrar"}
        </button>

        <div className="register-link">
          <span>¿No tienes cuenta?</span>
          <button
            type="button"
            className="btnRegister"
            onClick={() => navigate("/register")}
            disabled={loading}
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
