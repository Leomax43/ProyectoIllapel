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
        // Usamos un JOIN para traer también el nombre de la familia que compró
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
    // Agregamos clave_acceso a la extracción de datos
    const { rut_comercio, nombre_comercio, rubro, direccion, responsable, telefono, clave_acceso } = req.body;
    
    try {
        // Encriptar la contraseña antes de guardarla
        const saltRounds = 10;
        const claveAHashear = clave_acceso || '1234'; // Si no viene clave, usamos '1234' por defecto
        const claveHasheada = await bcrypt.hash(claveAHashear, saltRounds);

        // Agregamos la columna clave_acceso y el parámetro $7 a la consulta SQL
        const result = await pool.query(
            `INSERT INTO comercios (rut_comercio, nombre_comercio, rubro, direccion, responsable, telefono, saldo_acumulado, clave_acceso) 
             VALUES ($1, $2, $3, $4, $5, $6, 0, $7) RETURNING *`,
            [rut_comercio, nombre_comercio, rubro, direccion, responsable, telefono, claveHasheada]
        );
        res.status(201).json({ status: 'Éxito', mensaje: 'Comercio registrado correctamente', comercio: result.rows[0] });
    } catch (error) {
        console.error('Error al crear comercio:', error);
        // Manejo específico para evitar que la app explote si el RUT ya existe
        if (error.code === '23505') {
            return res.status(400).json({ status: 'Error', mensaje: 'El RUT del comercio ya está registrado.' });
        }
        res.status(500).json({ status: 'Error', mensaje: 'Error al registrar el comercio', error: error.message });
    }
};

// 4. Cambiar estado del comercio (Dar de baja / Activar)
const cambiarEstadoComercio = async (req, res) => {
    const { rut } = req.params;
    const { nuevo_estado } = req.body; // Puede ser 'ACTIVO' o 'BAJA'

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
    const { nombre_comercio, rubro, direccion, responsable, telefono } = req.body;

    try {
        const result = await pool.query(
            `UPDATE comercios 
             SET nombre_comercio = COALESCE($1, nombre_comercio),
                 rubro = COALESCE($2, rubro),
                 direccion = COALESCE($3, direccion),
                 responsable = COALESCE($4, responsable),
                 telefono = COALESCE($5, telefono)
             WHERE rut_comercio = $6 RETURNING *`,
            [nombre_comercio, rubro, direccion, responsable, telefono, rut]
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

module.exports = { obtenerComercios, obtenerComercioDetalle, crearComercio, cambiarEstadoComercio, actualizarComercio };
