const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // Mantenemos tu conexión directa por si acaso
require('dotenv').config();

// Importar rutas
const familiaRoutes = require('./routes/familiaRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const fondosRoutes = require('./routes/fondosRoutes');
const aprobacionesRoutes = require('./routes/aprobacionesRoutes');
const transaccionesRoutes = require('./routes/transaccionesRoutes');
const comerciosRoutes = require('./routes/comerciosRoutes');
const path = require('path');
const integrantesRoutes = require('./routes/integrantesRoutes');
const appMovilRoutes = require('./routes/appMovilRoutes');
const subrogacionRoutes = require('./routes/subrogacionRoutes');
const exportacionRoutes = require('./routes/exportacionRoutes');





const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Conectar las rutas
app.use('/api/familias', familiaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/fondos', fondosRoutes);
app.use('/api/aprobaciones', aprobacionesRoutes);
app.use('/api/transacciones', transaccionesRoutes);
app.use('/api/comercios', comerciosRoutes);
app.use('/archivosDocumentos', express.static(path.join(__dirname, 'archivosDocumentos')));
app.use('/api/integrantes', integrantesRoutes);
app.use('/api/movil', appMovilRoutes);
app.use('/api/subrogaciones', subrogacionRoutes);
app.use('/api/exportar', exportacionRoutes);

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