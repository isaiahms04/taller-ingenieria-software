import React, { useState } from "react";
import api from "../api"; // ajusta la ruta según tu proyecto

import axios from "axios";
import "./inscripcionModal.scss"; // estilos que te doy abajo

const InscripcionForm = ({ evento, onClose }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setMsg(null);
    setErr(null);

    try {
      await axios.post(`https://taller-ingenieria-software.vercel.app/inscripciones`, {
        evento_id: evento.id,
        nombre,
        email,
        telefono,
      });
      setMsg("✅ Inscripción realizada con éxito 🎉");
      setNombre("");
      setEmail("");
      setTelefono("");
    } catch (error) {
      if (error?.response?.status === 409)
        setErr("⚠️ Ya estás inscrito/a en este evento con ese email.");
      else setErr("❌ No pudimos inscribirte. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="cerrar" onClick={onClose}>
          ✕
        </button>
        <h2>Inscribirme en:</h2>
        <h3>{evento?.titulo}</h3>

        <form onSubmit={handleSubmit}>
          <label>Nombre*</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label>Email*</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Teléfono</label>
          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />

          <div className="acciones">
            <button
              type="button"
              className="cancelar"
              onClick={onClose}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button type="submit" disabled={enviando}>
              {enviando ? "Enviando..." : "Inscribirme"}
            </button>
          </div>
        </form>

        {msg && <p className="ok">{msg}</p>}
        {err && <p className="error">{err}</p>}
      </div>
    </div>
  );
};

export default InscripcionForm;
