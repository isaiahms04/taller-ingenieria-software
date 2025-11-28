import React, { useEffect, useState } from 'react';
import './navBar.scss';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem("user");
    setUser(u ? JSON.parse(u) : null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className='navBar'>
      <Link to="/">
        <div className="left">
          <img src="/img/ubo-logo.png" alt="" />
          <span>Eventos Estudiantiles</span>
        </div>
      </Link>

      <div className="center">
        {user && user.role === "admin" && (
          <Link to="/add">
            <button>Crear Evento</button>
          </Link>
        )}
        <Link to="/inscripciones">
          <button className="btnSecundario">Inscripciones</button>
        </Link>
      </div>

      <div className="right">
        <a href="http://www.intranet.ubo.cl" target='_blank' rel="noopener noreferrer">
          <span>Intranet</span>
        </a>
        <a href="https://aulavirtual.ubo.cl/" target='_blank' rel="noopener noreferrer">
          <span>Aulavirtual</span>
        </a>

        {/* 🔹 AQUI SE MUESTRA EL ROL */}
        {user && (
          <span className="rol">({user.role})</span>
        )}

        {!user ? (
          <Link to="/login">
            <button className="btnLogin">Iniciar sesión</button>
          </Link>
        ) : (
          <button className="btnLogout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        )}
      </div>
    </div>
  );
}

export default NavBar;
