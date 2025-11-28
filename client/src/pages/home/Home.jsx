import React, { useEffect, useState } from 'react'
import './home.scss'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Home = () => {

  const [eventos, setEventos] = useState([])

  useEffect(() => {
    const fetchAllEventos = async () => {
      try {
        // CORRECCIÓN 1: Usar la URL completa de Render
        const res = await axios.get("https://taller-ingenieria-software.onrender.com/eventos")
        setEventos(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchAllEventos()
  }, [])

  const handleDelete = async (id) => {
    try {
      // CORRECCIÓN 2: Usar URL completa Y comillas invertidas (backticks) ` `
      await axios.delete(`https://taller-ingenieria-software.onrender.com/eventos/${id}`)
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='home'>
      <h1>Eventos</h1>
      <div className="eventos">
        {/* CORRECCIÓN 3: Protección extra por si eventos es null o undefined */}
        {eventos && eventos.length > 0 ? (
           eventos.map(evento => (
            <div className="evento" key={evento.id}> {/* Agregué key={evento.id} para evitar warnings de React */}
              {evento.cover && <img src={evento.cover} alt="" />}
              <div className="contenido">
                <div className="informacion">
                  <h2>{evento.titulo}</h2>
                  <p>{evento.descripcion}</p>
                  <p>{evento.ubicacion}</p>
                  <p>{evento.fecha}</p>
                </div>
                <div className="botones">
                  <button className='btnEliminar' onClick={() => handleDelete(evento.id)}>Eliminar</button>
                  <Link to={`/update/${evento.id}`}><button className='btnActualizar'>Actualizar</button></Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay eventos registrados o cargando...</p>
        )}
      </div>
    </div>
  )
}

export default Home