import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Bl1ckyt32rn4",
    database:"eventos_estudiantiles"
})


app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.json("hola este es el backend")
})

app.get("/eventos", (req,res)=>{
    const q = "SELECT * FROM eventos"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})

app.post("/eventos",(req,res)=>{
    const q = "INSERT INTO eventos (`titulo`,`descripcion`,`ubicacion`,`fecha`,`cover`) VALUES (?)"

    const values = [
        req.body.titulo,
        req.body.descripcion,
        req.body.ubicacion,
        req.body.fecha,
        req.body.cover,
    ]

    db.query(q,[values], (err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})

app.delete("/eventos/:id", (req,res)=>{
    const eventoId = req.params.id;
    const q = "DELETE FROM eventos WHERE id = ?"


    db.query(q,[eventoId], (err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})

app.put("/eventos/:id", (req,res)=>{
    const eventoId = req.params.id;
    const q = "UPDATE eventos SET `titulo`= ?, `descripcion`= ?, `ubicacion`= ?, `fecha`= ? WHERE id = ?"

    const values = [
        req.body.titulo,
        req.body.descripcion,
        req.body.ubicacion,
        req.body.fecha,
    ]

    db.query(q,[...values,eventoId], (err,data)=>{
        if(err) return res.json(err)
            return res.json("evento has ido actualizado exitosamente")
    })
})

app.listen(8800, ()=>{
    console.log("conectado al backend1")
})  