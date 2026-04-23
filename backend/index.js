const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Endpoint de prueba (Health Check)
app.get('/health', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW()');
    res.status(200).json({ 
      status: 'OK', 
      mensaje: 'Backend conectado a PostgreSQL exitosamente', 
      hora_servidor: dbRes.rows[0].now 
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', mensaje: 'Fallo al conectar a BD', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});