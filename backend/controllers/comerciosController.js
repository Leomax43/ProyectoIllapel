const pool = require('../config/db');

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
            SELECT t.id_transaccion, t.monto, t.fecha, t.metodo_pago, f.rut_representante as rut_familia, f.nombre_familia
            FROM transacciones t
            JOIN familias f ON t.id_familia = f.id_familia
            WHERE t.rut_comercio = $1
            ORDER BY t.fecha DESC
        `, [rut]);

        res.status(200).json({
            status: 'Éxito',
            datos_comercio: comercio,
            historial_ventas: ventasRes.rows
        });

    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al obtener el detalle', error: error.message });
    }
};

// 3. Registrar un nuevo comercio
const crearComercio = async (req, res) => {
    const { rut_comercio, nombre_comercio, rubro, direccion, responsable, telefono } = req.body;
    
    try {
        const result = await pool.query(
            `INSERT INTO comercios (rut_comercio, nombre_comercio, rubro, direccion, responsable, telefono, saldo_acumulado) 
             VALUES ($1, $2, $3, $4, $5, $6, 0) RETURNING *`,
            [rut_comercio, nombre_comercio, rubro, direccion, responsable, telefono]
        );
        res.status(201).json({ status: 'Éxito', mensaje: 'Comercio registrado correctamente', comercio: result.rows[0] });
    } catch (error) {
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

module.exports = { obtenerComercios, obtenerComercioDetalle, crearComercio, cambiarEstadoComercio };