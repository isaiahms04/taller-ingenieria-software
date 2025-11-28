import React, { useEffect, useState } from 'react'
import './home.scss'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Home = () => {

  const [eventos, setEventos] = useState([])

  useEffect(() => {
    const fetchAllEventos = async () => {
      try {
        // Aseguramos pedir los datos al backend de Render
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
      await axios.delete(`https://taller-ingenieria-software.onrender.com/eventos/${id}`)
      // Filtramos el array localmente para no tener que recargar la página completa
      setEventos(eventos.filter(evento => evento.id !== id));
    } catch (err) {
      console.log(err)
    }
  }

  // Función para arreglar las URLs de las imágenes
  const getImageSrc = (cover) => {
    if (!cover || cover === "null.jpg") return "https://via.placeholder.com/300x200?text=Sin+Imagen";
    
    // Si la imagen viene con http, la cambiamos a https para que Vercel no la bloquee
    if (cover.startsWith("http:")) {
      return cover.replace("http:", "https:");
    }
    return cover;
  }

  return (
    <div className='home'>
      <h1>Eventos Disponibles</h1>
      <div className="eventos">
        {eventos.length > 0 ? (
          eventos.map(evento => (
            <div className="evento" key={evento.id}>
              
              <div className="img-container">
                <img 
                  src={getImageSrc(evento.cover)} 
                  alt={evento.titulo} 
                  onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=Error+Carga"; }}
                />
              </div>

              <div className="contenido">
                <div className="informacion">
                  <h2>{evento.titulo}</h2>
                  <p className="desc">{evento.descripcion}</p>
                  <p><strong>Ubicación:</strong> {evento.ubicacion}</p>
                  {/* Formateamos la fecha para que se lea bien */}
                  <p><strong>Fecha:</strong> {new Date(evento.fecha).toLocaleDateString()}</p>
                </div>
                
                <div className="botones">
                  <button className='btnEliminar' onClick={() => handleDelete(evento.id)}>Eliminar</button>
                  <Link to={`/update/${evento.id}`}>
                    <button className='btnActualizar'>Actualizar</button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay eventos cargados aún.</p>
        )}
      </div>
    </div>
  )
}

export default Home