const pool = require('./config/db');

const crearTablaSubrogaciones = async () => {
    try {
        console.log("--- Creando tabla subrogaciones ---");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS subrogaciones (
                id_subrogacion SERIAL PRIMARY KEY,
                id_admin_subrogado INT REFERENCES admin(id_admin),
                rol_asignado VARCHAR(50) NOT NULL,
                rol_original VARCHAR(50) NOT NULL,
                motivo TEXT,
                fecha_inicio TIMESTAMP NOT NULL,
                fecha_fin TIMESTAMP NOT NULL,
                estado VARCHAR(20) DEFAULT 'ACTIVO',
                id_super_admin INT REFERENCES admin(id_admin),
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("✔️ Tabla subrogaciones creada exitosamente.");
    } catch (error) {
        console.error("❌ Error al crear tabla subrogaciones:", error);
    } finally {
        pool.end();
    }
};

crearTablaSubrogaciones();