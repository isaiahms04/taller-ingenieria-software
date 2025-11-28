import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InscripcionForm from '../../components/InscripcionForm';
import './Inscripciones.scss';

const Inscripciones = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventoActivo, setEventoActivo] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/eventos-conteo');
        setEventos(Array.isArray(data) ? data : []);
      } catch (e) {
        setError('No pude cargar los eventos');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="page"><p>Cargando…</p></div>;
  if (error)   return <div className="page"><p>{error}</p></div>;

  return (
    <div className="page">
      <h1>Inscripciones</h1>
      <div className="grid">
        {eventos.map(ev => (
          <div className="card" key={ev.id}>
            {ev.cover && <img src={ev.cover} alt={ev.titulo} />}
            <div className="contenido">
              <div className="fila">
                <h3>{ev.titulo}</h3>
                <span className="chip">{ev.inscritos} inscrito{ev.inscritos === 1 ? '' : 's'}</span>
              </div>
              <p>{ev.descripcion}</p>
              <small>{ev.ubicacion} • {ev.fecha}</small>
              <div className=" acciones"> 
                <button onClick={() => setEventoActivo(ev)}>Inscribirme</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {eventoActivo && (
        <InscripcionForm evento={eventoActivo} onClose={() => setEventoActivo(null)} />
      )}
    </div>
  );
};

export default Inscripciones;
