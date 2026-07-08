

/*¨este es de prueba en la nube
// backend/config/db.js
const { Pool } = require('pg');

// Conexión forzada a la nube (solo para poblar datos)
const pool = new Pool({
  connectionString: 'postgresql://db_illapel_user:Xmmyifm8GX4xf2AzjWs754wmUV8IUfFV@dpg-d92jevmgvqtc73efqne0-a.oregon-postgres.render.com/db_illapel',
  ssl: { rejectUnauthorized: false } // Requisito obligatorio de Render para conexiones externas
});

pool.on('error', (err) => {
  console.error('Error inesperado en la base de datos', err);
  process.exit(-1);
});

module.exports = pool;


*/







// backend/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  
});

pool.on('error', (err) => {
  console.error('Error inesperado en la base de datos', err);
  process.exit(-1);
});

module.exports = pool;





