import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './update.scss';

const Update = () => {

  const [evento,setEvento] = useState({
    titulo:"",
    descripcion:"",
    ubicacion:"",
    fecha:"",
    cover: "null.jpg"
  });

  const navigate = useNavigate();
  const location = useLocation();

  const eventoId = location.pathname.split("/")[2]


  const handleChange = (e) => {
    setEvento((prev)=>({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async e =>{
    e.preventDefault()
    try {
      await axios.put("http://localhost:8800/eventos/"+eventoId, evento)
      navigate("/")
    } catch (err) {
      
    }
  };

  console.log(evento);

  return (
    <div className='form'>
      <h1>Actualizar Evento</h1>
      <div className="formContenido">
        <input type="text" placeholder='titulo' onChange={handleChange} name='titulo'/>
        <input type="text" placeholder='descripcion' onChange={handleChange} name='descripcion'/>
        <input type="text" placeholder='ubicacion' onChange={handleChange} name='ubicacion'/>
        <input type="datetime-local" placeholder='fecha' onChange={handleChange} name='fecha'/>
        
        
        <button onClick={handleClick}>Actualizar</button>
      </div>
    </div>
  )
}

export default Update