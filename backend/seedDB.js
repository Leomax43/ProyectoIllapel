const pool = require('./config/db');

const insertarDatosPrueba = async () => {
    try {
        console.log("Iniciando inyección de datos de prueba...");

        // 1. Insertar Administradores (1 Asistente Social y 1 Jefatura)
        // Usamos contraseñas simples por ahora (en el futuro irán encriptadas con bcrypt)
        await pool.query(`
            INSERT INTO admin (rut, nombre_completo, rol, clave, estado) VALUES 
            ('11111111-1', 'María González Rojas', 'ASISTENTE_SOCIAL', '1234', 'ACTIVO'),
            ('22222222-2', 'Carlos Muñoz Araya', 'JEFATURA', 'admin123', 'ACTIVO')
            ON CONFLICT DO NOTHING;
        `);
        console.log("- Administradores creados.");

        // 2. Insertar Familias
        await pool.query(`
            INSERT INTO familias (rut_representante, nombre_familia, direccion, telefono, clave_acceso, saldo, estado) VALUES 
            ('12345678-9', 'Familia Martínez Ríos', 'Los Aromos 432, Illapel', '+56912345678', '1234', 45000, 'ACTIVO'),
            ('9876543-2', 'Familia Pérez Fuentes', 'Calle Larga 12, Illapel', '+56987654321', '1234', 0, 'PENDIENTE')
            ON CONFLICT DO NOTHING;
        `);
        console.log("- Familias creadas.");

        // 3. Insertar Integrantes (Asociados a la Familia 1)
        await pool.query(`
            INSERT INTO integrantes (id_familia, nombre_completo, rut, parentesco, edad) VALUES 
            (1, 'Rosa Martínez Ríos', '12345678-9', 'Jefa de Hogar', 48),
            (1, 'Carlos Martínez Ríos', '11222333-5', 'Cónyuge', 45),
            (1, 'Sofía Martínez Ríos', '20111222-6', 'Hija', 15)
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

        // 5. Simular Cargas de Fondos (La Asistente Social le carga a la Familia 1)
        await pool.query(`
            INSERT INTO cargas_fondos (id_familia, id_admin, monto, fecha) VALUES 
            (1, 1, 50000, CURRENT_TIMESTAMP - INTERVAL '2 days'),
            (1, 1, 40000, CURRENT_TIMESTAMP - INTERVAL '1 month')
        `);
        console.log("- Historial de cargas registrado.");

        // 6. Simular Transacciones (La Familia 1 compra en el Minimarket)
        await pool.query(`
            INSERT INTO transacciones (id_familia, rut_comercio, monto, metodo_pago, fecha) VALUES 
            (1, '76111222-3', 12000, 'QR', CURRENT_TIMESTAMP - INTERVAL '1 day'),
            (1, '76111222-3', 8500, 'RUT+PIN', CURRENT_TIMESTAMP - INTERVAL '2 hours')
        `);
        console.log("- Transacciones de prueba registradas.");

        console.log("¡Todos los datos de prueba fueron inyectados con éxito!");

    } catch (error) {
        console.error("Error al inyectar datos:", error);
    } finally {
        pool.end();
    }
};

insertarDatosPrueba();