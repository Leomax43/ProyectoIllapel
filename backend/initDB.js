const pool = require('./config/db');

const crearTablas = async () => {
    try {
        console.log("--- Reiniciando Base de Datos (V5.1 - Modelo Normalizado con Claves de Comercio) ---");

        await pool.query('BEGIN');

        await pool.query(`
            DROP TABLE IF EXISTS transacciones CASCADE;
            DROP TABLE IF EXISTS cargas_fondos CASCADE;
            DROP TABLE IF EXISTS integrantes CASCADE;
            DROP TABLE IF EXISTS familias CASCADE;
            DROP TABLE IF EXISTS comercios CASCADE;
            DROP TABLE IF EXISTS admin CASCADE;
        `);
        console.log("✔️ Tablas antiguas eliminadas.");

        // 1. Tabla Admin
        await pool.query(`
            CREATE TABLE admin (
                id_admin SERIAL PRIMARY KEY,
                rut VARCHAR(12) UNIQUE NOT NULL,
                nombre_completo VARCHAR(100) NOT NULL,
                rol VARCHAR(50) NOT NULL, 
                clave VARCHAR(255) NOT NULL,
                estado VARCHAR(20) DEFAULT 'ACTIVO'
            );
        `);

        // 2. Tabla Familias
        await pool.query(`
            CREATE TABLE familias (
                id_familia SERIAL PRIMARY KEY,
                folio_historico INT UNIQUE,                
                rut_representante VARCHAR(12) UNIQUE NOT NULL,    
                nombre_representante VARCHAR(150) NOT NULL, 
                direccion VARCHAR(255),
                sector_localidad VARCHAR(100),              
                telefono VARCHAR(20),                       
                clave_acceso VARCHAR(255) NOT NULL,         
                saldo INT DEFAULT 0,
                estado VARCHAR(20) DEFAULT 'ACTIVO',
                pdf_ficha_social VARCHAR(255),
                observaciones TEXT,                         
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 3. Tabla Integrantes
        await pool.query(`
            CREATE TABLE integrantes (
                id_integrante SERIAL PRIMARY KEY,
                id_familia INT REFERENCES familias(id_familia) ON DELETE RESTRICT, 
                nombre_completo VARCHAR(150) NOT NULL,
                rut VARCHAR(12), 
                parentesco VARCHAR(50), 
                sexo VARCHAR(10), 
                fecha_nacimiento DATE, 
                correo_electronico VARCHAR(100), 
                telefono VARCHAR(20),
                tiene_discapacidad BOOLEAN DEFAULT FALSE,
                observaciones TEXT 
            );
        `);

        // 4. Tabla Comercios (¡AQUÍ ESTÁ LA NUEVA COLUMNA!)
        await pool.query(`
            CREATE TABLE comercios (
                rut_comercio VARCHAR(12) PRIMARY KEY,
                nombre_comercio VARCHAR(100) NOT NULL,
                rubro VARCHAR(50),
                direccion VARCHAR(255),
                responsable VARCHAR(100),
                telefono VARCHAR(20),
                clave_acceso VARCHAR(255) NOT NULL, 
                saldo_acumulado INT DEFAULT 0,
                estado VARCHAR(20) DEFAULT 'ACTIVO',
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 5. Tabla Cargas de Fondos
        await pool.query(`
            CREATE TABLE cargas_fondos (
                id_carga SERIAL PRIMARY KEY,
                id_familia INT REFERENCES familias(id_familia),
                rut_beneficiario VARCHAR(12), 
                id_admin INT REFERENCES admin(id_admin), 
                id_jefatura INT REFERENCES admin(id_admin),
                monto INT NOT NULL,
                motivo VARCHAR(50),
                detalles VARCHAR(500), 
                estado VARCHAR(20) DEFAULT 'PENDIENTE', 
                fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_aprobacion TIMESTAMP,
                dias_validez INT DEFAULT 7, 
                fecha_expiracion TIMESTAMP, 
                pdf_resolucion VARCHAR(255)
            );
        `);

        // 6. Tabla Transacciones
        await pool.query(`
            CREATE TABLE transacciones (
                id_transaccion SERIAL PRIMARY KEY,
                id_familia INT REFERENCES familias(id_familia),
                rut_comercio VARCHAR(12) REFERENCES comercios(rut_comercio),
                monto INT NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                metodo_pago VARCHAR(20) DEFAULT 'APP_MOVIL'
            );
        `);

        await pool.query('COMMIT');
        console.log("✔️ Estructura definitiva creada exitosamente.");

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("❌ Error fatal al recrear tablas:", error);
    } finally {
        pool.end();
    }
};

crearTablas();