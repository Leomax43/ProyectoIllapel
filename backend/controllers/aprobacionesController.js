const pool = require('../config/db');

// 1. Cambiar el estado de una familia (Ej: Activo, Rechazado, Baja) - ¡Mantenemos tu función original!
const cambiarEstadoFamilia = async (req, res) => {
    // Capturamos el ID de la familia desde la URL y el nuevo estado desde el body
    const { id_familia } = req.params;
    const { nuevo_estado } = req.body; // Puede ser 'ACTIVO', 'RECHAZADO', 'BAJA'

    try {
        const result = await pool.query(
            'UPDATE familias SET estado = $1 WHERE id_familia = $2 RETURNING rut_representante, nombre_familia, estado',
            [nuevo_estado, id_familia]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'Error', mensaje: 'Familia no encontrada' });
        }

        res.status(200).json({
            status: 'Éxito',
            mensaje: `El estado de la familia se ha actualizado correctamente a ${nuevo_estado}`,
            familia: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al cambiar estado', error: error.message });
    }
};

// 2. Listar todas las solicitudes de fondos que están PENDIENTES (NUEVA)
const obtenerSolicitudesFondos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT cf.*, f.nombre_familia, f.rut_representante, a.nombre_completo as nombre_asistente
            FROM cargas_fondos cf
            JOIN familias f ON cf.id_familia = f.id_familia
            JOIN admin a ON cf.id_admin = a.id_admin
            WHERE cf.estado = 'PENDIENTE'
            ORDER BY cf.fecha DESC
        `);
        res.status(200).json({ status: 'Éxito', solicitudes: result.rows });
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al obtener solicitudes', error: error.message });
    }
};

// 3. Aprobar una solicitud de carga (NUEVA - Aquí ocurre la transacción SQL segura)
const aprobarSolicitudFondo = async (req, res) => {
    const { id_carga } = req.params;
    const { id_jefatura } = req.body;

    try {
        await pool.query('BEGIN');

        // Verificamos que la carga exista y siga pendiente
        const cargaRes = await pool.query('SELECT id_familia, monto, estado FROM cargas_fondos WHERE id_carga = $1', [id_carga]);
        
        if (cargaRes.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ status: 'Error', mensaje: 'Solicitud no encontrada.' });
        }

        if (cargaRes.rows[0].estado !== 'PENDIENTE') {
            await pool.query('ROLLBACK');
            return res.status(400).json({ status: 'Error', mensaje: 'Esta solicitud ya fue procesada previamente.' });
        }

        const { id_familia, monto } = cargaRes.rows[0];

        // A. Cambiar estado de la solicitud a APROBADO e inscribir qué Jefatura lo ejecutó
        await pool.query(
            "UPDATE cargas_fondos SET estado = 'APROBADO', id_jefatura = $1 WHERE id_carga = $2",
            [id_jefatura, id_carga]
        );

        // B. SUMAR EL DINERO REAL a la cuenta de la familia
        await pool.query(
            'UPDATE familias SET saldo = saldo + $1 WHERE id_familia = $2',
            [monto, id_familia]
        );

        await pool.query('COMMIT');
        res.status(200).json({ status: 'Éxito', mensaje: 'Solicitud aprobada. Fondos transferidos a la familia.' });

    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({ status: 'Error', mensaje: 'Error al procesar la aprobación', error: error.message });
    }
};

// 4. Rechazar una solicitud de carga (NUEVA)
const rechazarSolicitudFondo = async (req, res) => {
    const { id_carga } = req.params;
    const { id_jefatura } = req.body;

    try {
        const result = await pool.query(
            `UPDATE cargas_fondos SET estado = 'RECHAZADO', id_jefatura = $1 
             WHERE id_carga = $2 AND estado = 'PENDIENTE' RETURNING *`,
            [id_jefatura, id_carga]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ status: 'Error', mensaje: 'Solicitud no encontrada o ya procesada.' });
        }

        res.status(200).json({ status: 'Éxito', mensaje: 'Solicitud de fondos rechazada correctamente. No se alteró el saldo.' });
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al rechazar la solicitud', error: error.message });
    }
};

// Exportamos las 4 funciones ordenadamente
module.exports = { 
    cambiarEstadoFamilia, 
    obtenerSolicitudesFondos, 
    aprobarSolicitudFondo, 
    rechazarSolicitudFondo 
};