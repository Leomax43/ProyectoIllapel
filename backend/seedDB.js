const pool = require('./config/db');
const bcrypt = require('bcrypt');

const poblarBaseDeDatos = async () => {
    try {
        console.log("--- Iniciando poblado de Base de Datos V5.1 ---");

        const saltRounds = 10;
        const claveHasheada = await bcrypt.hash('1234', saltRounds);

        await pool.query('BEGIN');

        console.log("Insertando administradores...");
        const adminRes = await pool.query(`
            INSERT INTO admin (rut, nombre_completo, rol, clave, estado) VALUES
            ('11111111-1', 'Admin Supremo', 'SUPER_ADMIN', $1, 'ACTIVO'),
            ('22222222-2', 'Carlos Muñoz', 'JEFATURA', $1, 'ACTIVO'),
            ('33333333-3', 'María González', 'ASISTENTE_SOCIAL', $1, 'ACTIVO'),
            ('44444444-4', 'Pedro Operador', 'OPERADOR', $1, 'ACTIVO')
            RETURNING id_admin;
        `, [claveHasheada]);
        
        const idJefatura = adminRes.rows[1].id_admin;
        const idAsistente = adminRes.rows[2].id_admin;

        console.log("Insertando familias...");
        const familiasRes = await pool.query(`
            INSERT INTO familias (rut_representante, nombre_representante, direccion, telefono, clave_acceso, saldo, estado) VALUES
            ('12345678-9', 'Rosa Ríos', 'Los Aromos 432', '+56912345678', $1, 45000, 'ACTIVO'),
            ('9876543-2', 'José Pérez', 'Calle Las Rosas 12', '+56987654321', $1, 30000, 'ACTIVO')
            RETURNING id_familia;
        `, [claveHasheada]);

        const idFamMartinez = familiasRes.rows[0].id_familia;
        const idFamPerez = familiasRes.rows[1].id_familia;

        console.log("Insertando integrantes...");
        await pool.query(`
            INSERT INTO integrantes (id_familia, nombre_completo, rut, parentesco, fecha_nacimiento, tiene_discapacidad) VALUES
            ($1, 'Rosa Ríos', '12345678-9', 'Jefa de Hogar', '1980-05-10', false),
            ($1, 'Juan Martínez', '23456789-0', 'Hijo', '2010-08-15', false),
            ($2, 'José Pérez', '9876543-2', 'Jefe de Hogar', '1975-12-01', true),
            ($2, 'Ana Fuentes', '11223344-5', 'Cónyuge', '1978-03-20', false);
        `, [idFamMartinez, idFamPerez]);

        // SE INYECTA LA CLAVE A LOS COMERCIOS ($1)
        console.log("Insertando comercios...");
        await pool.query(`
            INSERT INTO comercios (rut_comercio, nombre_comercio, rubro, direccion, responsable, telefono, clave_acceso, saldo_acumulado) VALUES
            ('77777777-7', 'Supermercado El Centro', 'Abarrotes', 'Plaza de Armas 123', 'Luis Gómez', '+56999887766', $1, 5000),
            ('88888888-8', 'Ferretería Construye', 'Materiales', 'Av. Principal 456', 'Marta Silva', '+56911223344', $1, 0);
        `, [claveHasheada]);

        console.log("Insertando cargas de fondos...");
        await pool.query(`
            INSERT INTO cargas_fondos (id_familia, id_admin, id_jefatura, monto, motivo, detalles, estado, dias_validez, fecha_aprobacion, fecha_expiracion) VALUES
            ($1, $3, $4, 50000, 'Alimentación', 'Aprobado para víveres básicos', 'APROBADO', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days'),
            ($2, $3, $4, 30000, 'Salud', 'Medicamentos urgentes', 'APROBADO', 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '14 days'),
            ($1, $3, $4, 25000, 'Construcción', 'Revocado por jefatura', 'CANCELADO', 7, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '3 days');
        `, [idFamMartinez, idFamPerez, idAsistente, idJefatura]);

        console.log("Insertando transacciones...");
        await pool.query(`
            INSERT INTO transacciones (id_familia, rut_comercio, monto, metodo_pago) VALUES
            ($1, '77777777-7', 5000, 'QR App Movil');
        `, [idFamMartinez]);

        await pool.query('COMMIT');
        
        console.log("✔ Base de datos poblada exitosamente.");
        console.log("------------------------------------------------");
        console.log("Cuentas de prueba creadas (Clave: 1234):");
        console.log("Super Admin: 11111111-1");
        console.log("Jefatura: 22222222-2");
        console.log("Asistente: 33333333-3");
        console.log("Operador: 44444444-4");
        console.log("Familia (Rosa Ríos): 12345678-9 (Tiene $45.000)");
        console.log("Comercio (El Centro): 77777777-7 (¡Nuevo para testing!)");

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("❌ Error al poblar la base de datos:", error);
    } finally {
        pool.end();
    }
};

poblarBaseDeDatos();