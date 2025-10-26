import React from 'react';
import './navBar.scss';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <div className='navBar'>
      <Link to="/">
        <div className="left">
          
            <img src="/img/ubo-logo.png" alt="" />
            <span>Eventos Estudiantiles</span>
          
        </div>
      </Link>
      <div className="center">
        <Link to="/add">
          <button>Crear Evento</button>
        </Link>
      </div>
      <div className="right">
        <a href="http://www.intranet.ubo.cl" target='_blank'>
          <span>Intranet</span>
        </a>
        <a href="https://aulavirtual.ubo.cl/" target='_blank'>
          <span>Aulavirtual</span>
        </a>
      </div>
    </div>
  )
}

export default NavBar