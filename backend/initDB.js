const pool = require('./config/db');

const crearTablas = async () => {
    try {
        console.log("Iniciando creación de tablas (V2 - Arquitectura Completa)...");

        // 0. Limpiar base de datos anterior (Ideal para desarrollo)
        await pool.query(`
            DROP TABLE IF EXISTS transacciones CASCADE;
            DROP TABLE IF EXISTS cargas_fondos CASCADE;
            DROP TABLE IF EXISTS integrantes CASCADE;
            DROP TABLE IF EXISTS familias CASCADE;
            DROP TABLE IF EXISTS comercios CASCADE;
            DROP TABLE IF EXISTS admin CASCADE;
        `);

        // 1. Usuarios Municipales (Roles de Asistente y Jefatura)
        await pool.query(`
            CREATE TABLE admin (
                id_admin SERIAL PRIMARY KEY,
                rut VARCHAR(12) UNIQUE NOT NULL,
                nombre_completo VARCHAR(100) NOT NULL,
                rol VARCHAR(50) NOT NULL, -- 'ASISTENTE_SOCIAL' o 'JEFATURA'
                clave VARCHAR(255) NOT NULL,
                estado VARCHAR(20) DEFAULT 'ACTIVO'
            );
        `);

        // 2. Familias (Beneficiarios) - Expandido con estados y PDF
        await pool.query(`
            CREATE TABLE familias (
                id_familia SERIAL PRIMARY KEY,
                rut_representante VARCHAR(12) UNIQUE NOT NULL,
                nombre_familia VARCHAR(100) NOT NULL,
                direccion VARCHAR(255),
                telefono VARCHAR(20),
                clave_acceso VARCHAR(255) NOT NULL,
                saldo INT DEFAULT 0,
                estado VARCHAR(20) DEFAULT 'ACTIVO', -- <-- AHORA ES ACTIVO POR DEFECTO
                pdf_ficha_social VARCHAR(255) 
            );
        `);

        // 3. Integrantes del Núcleo Familiar
        await pool.query(`
            CREATE TABLE integrantes (
                id_integrante SERIAL PRIMARY KEY,
                id_familia INT REFERENCES familias(id_familia) ON DELETE CASCADE,
                nombre_completo VARCHAR(150) NOT NULL,
                rut VARCHAR(12), -- OPCIONAL (basado en el análisis de la Cartola)
                parentesco VARCHAR(50),
                fecha_nacimiento DATE
            );
        `);

        // 4. Comercios - Expandido
        await pool.query(`
            CREATE TABLE comercios (
                rut_comercio VARCHAR(12) PRIMARY KEY,
                nombre_comercio VARCHAR(100) NOT NULL,
                rubro VARCHAR(50),
                direccion VARCHAR(255),
                responsable VARCHAR(100),
                telefono VARCHAR(20),
                saldo_acumulado INT DEFAULT 0,
                estado VARCHAR(20) DEFAULT 'ACTIVO',
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- <-- ¡NUEVA COLUMNA!
            );
        `);

        // 5. Historial de Cargas de Fondos (AHORA CON ESTADOS)
        await pool.query(`
            CREATE TABLE cargas_fondos (
                id_carga SERIAL PRIMARY KEY,
                id_familia INT REFERENCES familias(id_familia),
                id_admin INT REFERENCES admin(id_admin), -- Asistente que solicita
                id_jefatura INT REFERENCES admin(id_admin), -- Jefatura que aprueba (puede ser NULL al inicio)
                monto INT NOT NULL,
                motivo VARCHAR(50), 
                detalles VARCHAR(500), 
                estado VARCHAR(20) DEFAULT 'PENDIENTE', -- <-- ESTADO DE LA SOLICITUD
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                pdf_resolucion VARCHAR(255)
            );
        `);

        // 6. Transacciones (Compras en comercios) - Expandido
        await pool.query(`
            CREATE TABLE transacciones (
                id_transaccion SERIAL PRIMARY KEY,
                id_familia INT REFERENCES familias(id_familia),
                rut_comercio VARCHAR(12) REFERENCES comercios(rut_comercio),
                monto INT NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                metodo_pago VARCHAR(20) -- 'QR' o 'RUT+PIN'
            );
        `);

        console.log("¡Tablas V2 creadas exitosamente en PostgreSQL!");
    } catch (error) {
        console.error("Error al crear las tablas:", error);
    } finally {
        pool.end();
    }
};

crearTablas();