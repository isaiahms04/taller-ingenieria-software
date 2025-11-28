import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { signToken, verifyToken, requireAdmin } from './authMiddleware.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: './key.env' });

const app = express();

// Conexión a MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
  connectionLimit: 10
});

// Middleware
app.use(express.json());

// ------------------ CORS ------------------
const allowedOrigins = [
  'https://taller-ingenieria-software.vercel.app', // Producción
  'http://localhost:3000'  // Desarrollo
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.includes(origin)){
      return callback(null, true);
    }
    // Permitir previews de Vercel
    if(origin.endsWith('.vercel.app')){
      return callback(null, true);
    }
    return callback(new Error('Bloqueado por CORS: ' + origin), false);
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// Archivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ------------------ RUTAS DE AUTH ------------------

// Registro
app.post('/auth/register', (req, res) => {
  const { nombre, email, password, role } = req.body;
  if (!nombre || !email || !password) return res.status(400).json({ success: false, error: 'FALTAN_CAMPOS' });

  const userRole = role === 'admin' ? 'admin' : 'user';
  const password_hash = bcrypt.hashSync(password, 10);

  const q = 'INSERT INTO users (nombre, email, password_hash, role) VALUES (?, ?, ?, ?)';
  db.query(q, [nombre, email, password_hash, userRole], (err, result) => {
    if(err){
      if(err.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, error: 'EMAIL_REGISTRADO' });
      console.error('DB_REGISTER error:', err);
      return res.status(500).json({ success: false, error: 'DB_REGISTER' });
    }
    const token = signToken({ id: result.insertId, email, role: userRole });
    return res.status(201).json({ success: true, user: { id: result.insertId, nombre, email, role: userRole }, token });
  });
});

// Login
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const q = 'SELECT id, nombre, email, password_hash, role FROM users WHERE email = ? LIMIT 1';
  db.query(q, [email], (err, rows) => {
    if(err){
      console.error('DB_LOGIN error:', err);
      return res.status(500).json({ success: false, error: 'DB_LOGIN' });
    }
    const user = rows[0];
    if(!user) return res.status(401).json({ success: false, error: 'CREDENCIALES' });
    const ok = bcrypt.compareSync(password, user.password_hash);
    if(!ok) return res.status(401).json({ success: false, error: 'CREDENCIALES' });
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return res.json({ success: true, user, token });
  });
});

// Upload
app.post('/upload', upload.single('image'), (req,res) => {
  if(!req.file) return res.status(400).json({ success: false, error: 'No se recibió archivo' });
  // NOTA: Asegúrate de tener la variable PUBLIC_URL en Render (ej: https://taller-ingenieria-software.onrender.com)
  const baseUrl = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
  const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
  return res.json({ success: true, url: fileUrl });
});

app.get("/", (req,res)=> res.json("hola este es el backend"));

// ------------------ RUTAS DE EVENTOS ------------------

// 1. Obtener todos los eventos
app.get("/eventos", (req,res)=>{
  const q = "SELECT * FROM eventos";
  db.query(q,(err,data)=>{
    if(err) return res.json(err);
    return res.json(data);
  });
});

// 2. Crear un nuevo evento (ESTO FALTABA)
app.post("/eventos", (req, res) => {
  const q = "INSERT INTO eventos (`titulo`, `descripcion`, `ubicacion`, `fecha`, `cover`) VALUES (?)";
  
  const values = [
    req.body.titulo,
    req.body.descripcion,
    req.body.ubicacion,
    req.body.fecha,
    req.body.cover
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("El evento ha sido creado exitosamente.");
  });
});

// 3. Eliminar un evento
app.delete("/eventos/:id", (req, res) => {
  const eventId = req.params.id;
  const q = "DELETE FROM eventos WHERE id = ?";

  db.query(q, [eventId], (err, data) => {
    if (err) return res.json(err);
    return res.json("El evento ha sido eliminado exitosamente.");
  });
});

// 4. Actualizar un evento
app.put("/eventos/:id", (req, res) => {
  const eventId = req.params.id;
  const q = "UPDATE eventos SET `titulo`= ?, `descripcion`= ?, `ubicacion`= ?, `fecha`= ?, `cover`= ? WHERE id = ?";

  const values = [
    req.body.titulo,
    req.body.descripcion,
    req.body.ubicacion,
    req.body.fecha,
    req.body.cover
  ];

  db.query(q, [...values, eventId], (err, data) => {
    if (err) return res.json(err);
    return res.json("El evento ha sido actualizado exitosamente.");
  });
});

// Servidor
const PORT = process.env.PORT || 8800;
app.listen(PORT, ()=> console.log("Servidor corriendo en puerto " + PORT));

// Comprobar conexión MySQL
db.query('SELECT 1', (err) => {
  if(err) console.error("❌ Error conectando a Railway:", err);
  else console.log("✅ Conexión MySQL lista (Railway)");
});