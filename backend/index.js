import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { signToken, verifyToken, requireAdmin } from './authMiddleware.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Bl1ckyt32rn4",
    database:"eventos_estudiantiles"
});

app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')); 
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });


app.post('/auth/register', (req, res) => {
  const { nombre, email, password, role } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ success: false, error: 'FALTAN_CAMPOS' });
  }

  const userRole = role === 'admin' ? 'admin' : 'user';

  const password_hash = bcrypt.hashSync(password, 10);

  const q = 'INSERT INTO users (nombre, email, password_hash, role) VALUES (?, ?, ?, ?)';

  db.query(q, [nombre, email, password_hash, userRole], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, error: 'EMAIL_REGISTRADO' });
      }
      console.error('DB_REGISTER error:', err);
      return res.status(500).json({ success: false, error: 'DB_REGISTER' });
    }

    const token = signToken({ id: result.insertId, email, role: userRole });

    return res.status(201).json({
      success: true,
      user: {
        id: result.insertId,
        nombre,
        email,
        role: userRole,
      },
      token,
    });
  });
});


app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  const q = 'SELECT id, nombre, email, password_hash, role FROM users WHERE email = ? LIMIT 1';

  db.query(q, [email], (err, rows) => {
    if (err) {
      console.error('DB_LOGIN error:', err);
      return res.status(500).json({ success: false, error: 'DB_LOGIN' });
    }

    const user = rows && rows[0];
    if (!user) {
      return res.status(401).json({ success: false, error: 'CREDENCIALES' });
    }

    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ success: false, error: 'CREDENCIALES' });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      success: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
      token,
    });
  });
});


app.get('/auth/me', verifyToken, (req, res) => {
  return res.json({ success: true, user: req.user });
});


app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No se recibió archivo' });
  }

  const fileUrl = `http://localhost:8800/uploads/${req.file.filename}`;
  return res.json({ success: true, url: fileUrl });
});

app.get("/",(req,res)=>{
    res.json("hola este es el backend");
});

app.get("/eventos", (req,res)=>{
    const q = "SELECT * FROM eventos";
    db.query(q,(err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    });
});

app.post("/eventos", verifyToken, requireAdmin,(req,res)=>{
    const q = "INSERT INTO eventos (`titulo`,`descripcion`,`ubicacion`,`fecha`,`cover`) VALUES (?)";

    const values = [
        req.body.titulo,
        req.body.descripcion,
        req.body.ubicacion,
        req.body.fecha,
        req.body.cover,
    ];

    db.query(q,[values], (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    });
});

app.delete("/eventos/:id", verifyToken, requireAdmin, (req,res)=>{
    const eventoId = req.params.id;
    const q = "DELETE FROM eventos WHERE id = ?";

    db.query(q,[eventoId], (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    });
});

app.put("/eventos/:id", verifyToken, requireAdmin, (req,res)=>{
    const eventoId = req.params.id;
    const q = "UPDATE eventos SET `titulo`= ?, `descripcion`= ?, `ubicacion`= ?, `fecha`= ?, `cover` = ? WHERE id = ?";

    const values = [
        req.body.titulo,
        req.body.descripcion,
        req.body.ubicacion,
        req.body.fecha,
        req.body.cover,
    ];

    db.query(q,[...values,eventoId], (err,data)=>{
        if(err) return res.json(err);
        return res.json("evento ha sido actualizado exitosamente");
    });
});

// tus rutas de inscripciones se mantienen igual:
app.post('/inscripciones', (req, res) => {
  const { evento_id, nombre, email, telefono } = req.body;

  if (!evento_id || !nombre || !email) {
    return res.status(400).json({ success: false, error: 'Faltan campos obligatorios' });
  }

  const q = `
    INSERT INTO inscripciones (evento_id, nombre, email, telefono)
    VALUES (?, ?, ?, ?)
  `;

  db.query(q, [evento_id, nombre, email, telefono ?? null], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, error: 'Ya estás inscrito/a en este evento con ese email' });
      }
      console.error('DB INSERT inscripciones error:', err);
      return res.status(500).json({ success: false, error: 'DB_INSERT_INSC' });
    }
    return res.status(201).json({ success: true, insertId: result.insertId });
  });
});

app.get('/eventos/:id/inscripciones', (req, res) => {
  const q = `
    SELECT id, nombre, email, telefono, created_at
    FROM inscripciones
    WHERE evento_id = ?
    ORDER BY created_at DESC
  `;
  db.query(q, [req.params.id], (err, rows) => {
    if (err) {
      console.error('DB GET inscripciones error:', err);
      return res.status(500).json({ success: false, error: 'DB_GET_INSCS' });
    }
    return res.json(rows);
  });
});

app.get('/eventos-conteo', (req, res) => {
  const q = `
    SELECT e.*,
           COALESCE(cnt.total, 0) AS inscritos
    FROM eventos e
    LEFT JOIN (
      SELECT evento_id, COUNT(*) AS total
      FROM inscripciones
      GROUP BY evento_id
    ) AS cnt ON cnt.evento_id = e.id
    ORDER BY e.id DESC
  `;
  db.query(q, (err, rows) => {
    if (err) {
      console.error('DB GET eventos-conteo error:', err);
      return res.status(500).json({ success: false, error: 'DB_GET_EVENTOS_CONTEO' });
    }
    return res.json(rows);
  });
});

app.listen(8800, ()=>{
    console.log("conectado al backend1");
});
