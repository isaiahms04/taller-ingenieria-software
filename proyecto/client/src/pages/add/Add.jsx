import React, { useState } from 'react';
import './add.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Add = () => {

  const [evento,setEvento] = useState({
    titulo:"",
    descripcion:"",
    ubicacion:"",
    fecha:"",
    cover: "null.jpg"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setEvento((prev)=>({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async e =>{
    e.preventDefault()
    try {
      await axios.post("http://localhost:8800/eventos", evento)
      navigate("/")
    } catch (err) {
      
    }
  };

  console.log(evento);

  return (
    <div className='form'>
      <h1>Añadir Evento</h1>
      <div className="formContenido">
          <input type="text" placeholder='titulo' onChange={handleChange} name='titulo'/>
        <input type="text" placeholder='descripcion' onChange={handleChange} name='descripcion'/>
        <input type="text" placeholder='ubicacion' onChange={handleChange} name='ubicacion'/>
        <input type="datetime-local" placeholder='fecha' onChange={handleChange} name='fecha'/>
        
        
        <button onClick={handleClick}>Añadir</button>
      </div>
    </div>
  )
}

export default Add;