import React, { useEffect, useState } from 'react'
import './home.scss'
import axios from 'axios'
import api from '../../api'; // Ajusta la ruta según tu proyecto

import { Link } from 'react-router-dom'

const Home = () => {

  const [eventos,setEventos] = useState([])

  useEffect(()=>{
    const fetchAllEventos = async ()=> {
      try {
        const res = await axios.get("/eventos")
        setEventos(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchAllEventos()
  },[])

  const handleDelete = async (id) => {
    try {
      await axios.delete("/eventos/${id}")
      window.location.reload()
    } catch (err) {
      
    }
  }

  return (
    <div className='home'>
      <h1>Eventos</h1>
      <div className="eventos">
        {eventos.map(evento=>(
          <div className="evento">
            {evento.cover && <img src={evento.cover} alt="" />}
            <div className="contenido">
              <div className="informacion">
                <h2>{evento.titulo}</h2>
                <p>{evento.descripcion}</p>
                <p>{evento.ubicacion}</p>
                <p>{evento.fecha}</p>
              </div>
              <div className="botones">
                <button className='btnEliminar' onClick={()=>handleDelete(evento.id)}>Eliminar</button>
                <Link to={`/update/${evento.id}`}><button className='btnActualizar'>Actualizar</button></Link>
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home