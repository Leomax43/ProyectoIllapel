const pool = require('./config/db');
const bcrypt = require('bcrypt'); // <-- IMPORTAR BCRYPT

const insertarDatosPrueba = async () => {
    try {
        console.log("Iniciando inyección de datos de prueba...");

        // Generar un hash para las claves (usaremos "1234" para todos por simplicidad en pruebas)
        const saltRounds = 10;
        const claveGenericaHasheada = await bcrypt.hash("1234", saltRounds);

        // 1. Insertar Administradores
        await pool.query(`
            INSERT INTO admin (rut, nombre_completo, rol, clave, estado) VALUES 
            ('11111111-1', 'María González Rojas', 'ASISTENTE_SOCIAL', $1, 'ACTIVO'),
            ('22222222-2', 'Carlos Muñoz Araya', 'JEFATURA', $1, 'ACTIVO')
            ON CONFLICT DO NOTHING;
        `, [claveGenericaHasheada]);
        console.log("- Administradores creados.");

        // 2. Insertar Familias
        await pool.query(`
            INSERT INTO familias (rut_representante, nombre_familia, direccion, telefono, clave_acceso, saldo, estado) VALUES 
            ('12345678-9', 'Familia Martínez Ríos', 'Los Aromos 432, Illapel', '+56912345678', $1, 45000, 'ACTIVO'),
            ('9876543-2', 'Familia Pérez Fuentes', 'Calle Larga 12, Illapel', '+56987654321', $1, 0, 'PENDIENTE')
            ON CONFLICT DO NOTHING;
        `, [claveGenericaHasheada]);
        console.log("- Familias creadas.");

        // 3. Insertar Integrantes (Asociados a la Familia 1)
        await pool.query(`
            INSERT INTO integrantes (id_familia, nombre_completo, rut, parentesco, fecha_nacimiento) VALUES 
            (1, 'Rosa Martínez Ríos', '12345678-9', 'Jefa de Hogar', '1978-03-12'),
            (1, 'Carlos Martínez Ríos', '11222333-5', 'Cónyuge', '1981-07-25'),
            (1, 'Sofía Martínez Ríos', '20111222-6', 'Hija', '2009-11-05')
        `);
        console.log("- Integrantes creados.");

        // 4. Insertar Comercios
        await pool.query(`
            INSERT INTO comercios (rut_comercio, nombre_comercio, rubro, direccion, responsable, telefono, saldo_acumulado, estado) VALUES 
            ('76111222-3', 'Minimarket Don Jorge', 'Alimentación', 'Av. Arturo Prat 210, Illapel', 'Jorge Fuentes Mora', '+56976543210', 284500, 'ACTIVO'),
            ('76333444-5', 'Ferretería El Clavo', 'Construcción', 'Calle Independencia 100, Illapel', 'Pedro Soto', '+56988889999', 142000, 'ACTIVO')
            ON CONFLICT DO NOTHING;
        `);
        console.log("- Comercios creados.");

        // 5. Simular cargas de fondos (La Asistente Social le carga a la familia 1)
        await pool.query(`
            INSERT INTO cargas_fondos (id_familia, id_admin, monto, motivo, detalles, fecha) VALUES 
            (1, 1, 50000, 'Alimentación', 'Familia en situación de vulnerabilidad. Requiere apoyo para adquirir alimentos básicos del hogar.', CURRENT_TIMESTAMP - INTERVAL '2 days'),
            (1, 1, 40000, 'Construcción', 'Reparación urgente de techo en riesgo de colapso. Peligro para la integridad física de los habitantes.', CURRENT_TIMESTAMP - INTERVAL '1 month')
        `);
        console.log("- Historial de cargas registrado.");

        // 6. Simular Transacciones (La Familia 1 compra en el Minimarket)
        await pool.query(`
            INSERT INTO transacciones (id_familia, rut_comercio, monto, metodo_pago, fecha) VALUES 
            (1, '76111222-3', 12000, 'QR', CURRENT_TIMESTAMP - INTERVAL '1 day'),
            (1, '76111222-3', 8500, 'RUT+PIN', CURRENT_TIMESTAMP - INTERVAL '5 hours')
        `);
        console.log("- Transacciones simuladas registradas.");

        console.log("¡Base de datos poblada exitosamente!");
        process.exit(0);

    } catch (error) {
        console.error("Error al inyectar datos:", error);
        process.exit(1);
    }
};

insertarDatosPrueba();