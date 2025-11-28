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

  // 🔹 NUEVO: subir imagen al backend
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:8800/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        setEvento((prev) => ({ ...prev, cover: res.data.url }));
      }
    } catch (err) {
      console.error("Error subiendo la imagen", err);
    }
  };

  const handleClick = async e =>{
    e.preventDefault()
    try {
      await axios.post("http://localhost:8800/eventos", evento)
      navigate("/")
    } catch (err) {
      console.log(err)
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

        {/* 🔹 NUEVO: input para subir foto */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
        />

        <button onClick={handleClick}>Añadir</button>
      </div>
    </div>
  )
}

export default Add;
