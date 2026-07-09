const pool = require('../config/db');
const bcrypt = require('bcrypt'); // Añadida la importación para encriptar la contraseña

// 1. Obtener todos los comercios (Para la tabla principal)
const obtenerComercios = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM comercios ORDER BY nombre_comercio ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al obtener los comercios', error: error.message });
    }
};

// 2. Obtener detalle de un comercio específico y su historial de ventas
const obtenerComercioDetalle = async (req, res) => {
    const { rut } = req.params;

    try {
        // Buscar los datos base del comercio
        const comRes = await pool.query('SELECT * FROM comercios WHERE rut_comercio = $1', [rut]);
        
        if (comRes.rows.length === 0) {
            return res.status(404).json({ status: 'Error', mensaje: 'Comercio no encontrado' });
        }
        
        const comercio = comRes.rows[0];

        // Buscar el historial de ventas en este comercio
        const ventasRes = await pool.query(`
            SELECT t.id_transaccion, t.monto, t.fecha, t.metodo_pago, f.rut_representante as rut_familia, f.nombre_representante, f.id_familia
            FROM transacciones t
            JOIN familias f ON t.id_familia = f.id_familia
            WHERE t.rut_comercio = $1
            ORDER BY t.fecha DESC
        `, [rut]);

        // Mapear ventas para incluir nombre_familia computado
        const generarNombreFamilia = (nombre_representante, id_familia) => {
            const apellido = (nombre_representante || '').split(' ').pop() || 'Familia';
            return `${apellido}-${String(id_familia).padStart(2, '0')}`;
        };
        const historial_ventas = ventasRes.rows.map(v => ({
            ...v,
            nombre_familia: generarNombreFamilia(v.nombre_representante, v.id_familia)
        }));

        res.status(200).json({
            status: 'Éxito',
            datos_comercio: comercio,
            historial_ventas
        });

    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al obtener el detalle', error: error.message });
    }
};

// 3. Registrar un nuevo comercio
const crearComercio = async (req, res) => {
    // Agregamos los nuevos campos a la extracción de datos
    const { 
        rut_comercio, nombre_comercio, rubro, direccion, responsable, telefono, 
        clave_acceso, correo_electronico, nombre_banco, tipo_cuenta, numero_cuenta 
    } = req.body;
    
    try {
        const saltRounds = 10;
        const claveAHashear = clave_acceso || '1234'; 
        const claveHasheada = await bcrypt.hash(claveAHashear, saltRounds);

        // Agregamos los parámetros para los nuevos campos en la consulta SQL
        const result = await pool.query(
            `INSERT INTO comercios (rut_comercio, nombre_comercio, rubro, direccion, responsable, telefono, 
             correo_electronico, nombre_banco, tipo_cuenta, numero_cuenta, saldo_acumulado, clave_acceso) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0, $11) RETURNING *`,
            [rut_comercio, nombre_comercio, rubro, direccion, responsable, telefono, 
             correo_electronico, nombre_banco, tipo_cuenta, numero_cuenta, claveHasheada]
        );
        res.status(201).json({ status: 'Éxito', mensaje: 'Comercio registrado correctamente', comercio: result.rows[0] });
    } catch (error) {
        console.error('Error al crear comercio:', error);
        if (error.code === '23505') {
            return res.status(400).json({ status: 'Error', mensaje: 'El RUT del comercio ya está registrado.' });
        }
        res.status(500).json({ status: 'Error', mensaje: 'Error al registrar el comercio', error: error.message });
    }
};

// 4. Cambiar estado del comercio
const cambiarEstadoComercio = async (req, res) => {
    const { rut } = req.params;
    const { nuevo_estado } = req.body;

    try {
        const result = await pool.query(
            'UPDATE comercios SET estado = $1 WHERE rut_comercio = $2 RETURNING *',
            [nuevo_estado, rut]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'Error', mensaje: 'Comercio no encontrado' });
        }

        res.status(200).json({ 
            status: 'Éxito', 
            mensaje: `El estado del comercio ha sido actualizado a ${nuevo_estado}`, 
            comercio: result.rows[0] 
        });
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al cambiar el estado', error: error.message });
    }
};

// 5. Actualizar datos de un comercio
const actualizarComercio = async (req, res) => {
    const { rut } = req.params;
    // Agregamos los nuevos campos aquí
    const { nombre_comercio, rubro, direccion, responsable, telefono, correo_electronico, nombre_banco, tipo_cuenta, numero_cuenta } = req.body;

    try {
        const result = await pool.query(
            `UPDATE comercios 
             SET nombre_comercio = COALESCE($1, nombre_comercio),
                 rubro = COALESCE($2, rubro),
                 direccion = COALESCE($3, direccion),
                 responsable = COALESCE($4, responsable),
                 telefono = COALESCE($5, telefono),
                 correo_electronico = COALESCE($6, correo_electronico),
                 nombre_banco = COALESCE($7, nombre_banco),
                 tipo_cuenta = COALESCE($8, tipo_cuenta),
                 numero_cuenta = COALESCE($9, numero_cuenta)
             WHERE rut_comercio = $10 RETURNING *`,
            [nombre_comercio, rubro, direccion, responsable, telefono, correo_electronico, nombre_banco, tipo_cuenta, numero_cuenta, rut]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'Error', mensaje: 'Comercio no encontrado' });
        }

        res.status(200).json({
            status: 'Éxito',
            mensaje: 'Comercio actualizado correctamente',
            comercio: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al actualizar el comercio', error: error.message });
    }
};

// --- NUEVAS FUNCIONES DE LIQUIDACIÓN ---

// 6. Liquidar fondos de un comercio (pagarle y dejar saldo en 0)
const liquidarComercio = async (req, res) => {
    const { rut } = req.params;
    const { id_admin, monto_liquidado } = req.body;

    try {
        await pool.query('BEGIN'); // Transacción segura

        // Bloqueamos la fila temporalmente para que nadie más la modifique mientras leemos
        const comRes = await pool.query('SELECT saldo_acumulado FROM comercios WHERE rut_comercio = $1 FOR UPDATE', [rut]);

        if (comRes.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ status: 'Error', mensaje: 'Comercio no encontrado' });
        }

        const saldoActual = parseFloat(comRes.rows[0].saldo_acumulado);
        const montoALiquidar = parseFloat(monto_liquidado);

        if (saldoActual <= 0) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ status: 'Error', mensaje: 'El comercio no tiene saldo acumulado para liquidar.' });
        }

        // Armamos la ruta del PDF si se adjuntó
        let pdfComprobantePath = null;
        if (req.file) {
            pdfComprobantePath = `/archivosDocumentos/comercios/${rut}/${req.file.filename}`;
        }

        // Registramos la liquidación en el historial
        const insertRes = await pool.query(
            `INSERT INTO liquidaciones_comercios (rut_comercio, id_admin, monto_liquidado, pdf_comprobante) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [rut, id_admin, montoALiquidar, pdfComprobantePath]
        );

        // Reiniciamos el saldo del comercio a 0
        await pool.query(
            'UPDATE comercios SET saldo_acumulado = 0 WHERE rut_comercio = $1',
            [rut]
        );

        await pool.query('COMMIT');

        res.status(200).json({
            status: 'Éxito',
            mensaje: 'Liquidación registrada correctamente. El saldo del comercio ahora es $0.',
            liquidacion: insertRes.rows[0]
        });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Error al liquidar comercio:", error);
        res.status(500).json({ status: 'Error', mensaje: 'Error interno al procesar la liquidación', error: error.message });
    }
};

// 7. Obtener el historial de liquidaciones de un comercio
const obtenerLiquidacionesComercio = async (req, res) => {
    const { rut } = req.params;
    try {
        const result = await pool.query(`
            SELECT l.*, a.nombre_completo as responsable 
            FROM liquidaciones_comercios l
            JOIN admin a ON l.id_admin = a.id_admin
            WHERE l.rut_comercio = $1
            ORDER BY l.fecha_liquidacion DESC
        `, [rut]);
        
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al obtener liquidaciones', error: error.message });
    }
};

module.exports = { 
    obtenerComercios, 
    obtenerComercioDetalle, 
    crearComercio, 
    cambiarEstadoComercio, 
    actualizarComercio,
    liquidarComercio,
    obtenerLiquidacionesComercio
};