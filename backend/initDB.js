// backend/initDB.js
const pool = require('./config/db.js');

const createTables = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS familias (
        id_familia SERIAL PRIMARY KEY,
        rut_representante VARCHAR(12) UNIQUE NOT NULL,
        nombre_familia VARCHAR(100) NOT NULL,
        clave_acceso VARCHAR(255) NOT NULL,
        saldo INTEGER DEFAULT 0,
        fecha_ultima_recarga TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tiendas (
        id_tienda SERIAL PRIMARY KEY,
        rut_comercial VARCHAR(12) UNIQUE NOT NULL,
        nombre_tienda VARCHAR(100) NOT NULL,
        clave_acceso VARCHAR(255) NOT NULL,
        saldo INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS transacciones (
        id_transaccion SERIAL PRIMARY KEY,
        id_familia INTEGER REFERENCES familias(id_familia),
        id_tienda INTEGER REFERENCES tiendas(id_tienda),
        monto INTEGER NOT NULL,
        fecha_transaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    console.log("Iniciando creación de tablas...");
    await pool.query(query);
    console.log("¡Tablas creadas exitosamente en PostgreSQL!");
  } catch (error) {
    console.error("Error al crear las tablas:", error);
  } finally {
    pool.end();
  }
};

createTables();