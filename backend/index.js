const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // Mantenemos tu conexión directa por si acaso
require('dotenv').config();

// Importar rutas
const familiaRoutes = require('./routes/familiaRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Conectar las rutas de familias
app.use('/api/familias', familiaRoutes);

// Endpoint de prueba (Health Check)
app.get('/health', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW()');
    res.status(200).json({ status: 'OK', mensaje: 'Backend conectado a PostgreSQL', hora: dbRes.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', mensaje: 'Fallo al conectar', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});