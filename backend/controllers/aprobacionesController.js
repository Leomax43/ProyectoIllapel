const pool = require('../config/db');

// Helper para generar nombre_familia con formato "Apellido-ID"
const generarNombreFamilia = (nombre_representante, id_familia) => {
    const apellido = (nombre_representante || '').split(' ').pop() || 'Familia';
    return `${apellido}-${String(id_familia).padStart(2, '0')}`;
};

// 1. Cambiar el estado de una familia (Ej: Activo, Rechazado, Baja) - ¡Tu función original intacta!
const cambiarEstadoFamilia = async (req, res) => {
    const { id_familia } = req.params;
    const { nuevo_estado } = req.body; 

    try {
        const result = await pool.query(
            'UPDATE familias SET estado = $1 WHERE id_familia = $2 RETURNING rut_representante, nombre_representante, estado',
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

// 2. Listar todas las solicitudes de fondos que están PENDIENTES
const obtenerSolicitudesFondos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT cf.*, f.nombre_representante, f.rut_representante, f.id_familia, a.nombre_completo as nombre_asistente
            FROM cargas_fondos cf
            JOIN familias f ON cf.id_familia = f.id_familia
            JOIN admin a ON cf.id_admin = a.id_admin
            WHERE cf.estado = 'PENDIENTE'
            ORDER BY cf.fecha_solicitud DESC
        `);
        
        // Mapear para incluir nombre_familia computado y fecha como alias
        const solicitudes = result.rows.map(s => ({
            ...s,
            nombre_familia: generarNombreFamilia(s.nombre_representante, s.id_familia),
            fecha: s.fecha_solicitud
        }));
        
        res.status(200).json({ status: 'Éxito', solicitudes });
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al obtener solicitudes', error: error.message });
    }
};

// 3. Aprobar una solicitud de carga (Transacción SQL segura + Cálculo de Expiración)
const aprobarSolicitudFondo = async (req, res) => {
    const { id_carga } = req.params;
    const { id_jefatura } = req.body;

    try {
        await pool.query('BEGIN');

        // Verificamos que la carga exista y siga pendiente (añadimos dias_validez a la lectura)
        const cargaRes = await pool.query(
            'SELECT id_familia, monto, estado, dias_validez FROM cargas_fondos WHERE id_carga = $1 FOR UPDATE', 
            [id_carga]
        );
        
        if (cargaRes.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ status: 'Error', mensaje: 'Solicitud no encontrada.' });
        }

        if (cargaRes.rows[0].estado !== 'PENDIENTE') {
            await pool.query('ROLLBACK');
            return res.status(400).json({ status: 'Error', mensaje: 'Esta solicitud ya fue procesada previamente.' });
        }

        const { id_familia, monto, dias_validez } = cargaRes.rows[0];

        // A. Cambiar estado a APROBADO, registrar jefatura, fecha de aprobación y calcular fecha_expiracion en base a los días
        await pool.query(
            `UPDATE cargas_fondos 
             SET estado = 'APROBADO', 
                 id_jefatura = $1, 
                 fecha_aprobacion = CURRENT_TIMESTAMP,
                 fecha_expiracion = CURRENT_TIMESTAMP + ($2 || ' days')::interval 
             WHERE id_carga = $3`,
            [id_jefatura, dias_validez, id_carga]
        );

        // B. SUMAR EL DINERO REAL a la cuenta de la familia
        await pool.query(
            'UPDATE familias SET saldo = saldo + $1 WHERE id_familia = $2',
            [monto, id_familia]
        );

        await pool.query('COMMIT');
        res.status(200).json({ status: 'Éxito', mensaje: 'Solicitud aprobada. Fondos transferidos a la familia con tiempo límite.' });

    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({ status: 'Error', mensaje: 'Error al procesar la aprobación', error: error.message });
    }
};

// 4. Rechazar una solicitud de carga
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

        res.status(200).json({ status: 'Éxito', mensaje: 'Solicitud de fondos rechazazada correctamente. No se alteró el saldo.' });
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al rechazar la solicitud', error: error.message });
    }
};

// 5. Cancelar / Revocar un beneficio ya entregado (NUEVA REGLA DE NEGOCIO)
const cancelarSolicitudFondo = async (req, res) => {
    const { id_carga } = req.params;
    const { id_admin } = req.body; // ID del funcionario con permisos que revoca el beneficio

    try {
        await pool.query('BEGIN');

        // Buscar la carga aprobada para auditarla
        const cargaRes = await pool.query('SELECT * FROM cargas_fondos WHERE id_carga = $1 FOR UPDATE', [id_carga]);
        if (cargaRes.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ status: 'Error', mensaje: 'Carga de fondos no encontrada.' });
        }
        
        const carga = cargaRes.rows[0];

        // Validar que esté aprobada antes de intentar cancelarla
        if (carga.estado !== 'APROBADO') {
            await pool.query('ROLLBACK');
            return res.status(400).json({ status: 'Error', mensaje: 'Solo se pueden revocar beneficios que estén en estado APROBADO.' });
        }

        // Validar si el beneficio ya venció por transcurso de tiempo natural
        if (carga.fecha_expiracion && new Date() > new Date(carga.fecha_expiracion)) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ status: 'Error', mensaje: 'El beneficio ya expiró por límite de tiempo. No requiere cancelación manual.' });
        }

        // Validar que la familia no haya gastado el saldo en un comercio (Evita saldos negativos)
        const famRes = await pool.query('SELECT saldo FROM familias WHERE id_familia = $1', [carga.id_familia]);
        if (famRes.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ status: 'Error', mensaje: 'Familia asociada no encontrada.' });
        }

        if (famRes.rows[0].saldo < carga.monto) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ 
                status: 'Error', 
                mensaje: 'La familia ya utilizó parte o la totalidad de estos fondos en comercios asociados. No es posible cancelar el beneficio.' 
            });
        }

        // Restar el dinero del saldo disponible de la familia
        await pool.query(
            'UPDATE familias SET saldo = saldo - $1 WHERE id_familia = $2',
            [carga.monto, carga.id_familia]
        );

        // Marcar la transacción como CANCELADA e inyectar bitácora en la columna detalles
        await pool.query(
            `UPDATE cargas_fondos 
             SET estado = 'CANCELADO', 
                 detalles = COALESCE(detalles, '') || ' [Beneficio revocado manualmente por funcionario ID: ' || $1 || ']' 
             WHERE id_carga = $2`,
            [id_admin, id_carga]
        );

        await pool.query('COMMIT');
        res.status(200).json({ status: 'Éxito', mensaje: 'Beneficio revocado con éxito. El monto fue retirado de la cuenta familiar.' });

    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({ status: 'Error', mensaje: 'Error al procesar la cancelación del beneficio', error: error.message });
    }
};

// Exportamos las 5 funciones ordenadamente
module.exports = { 
    cambiarEstadoFamilia, 
    obtenerSolicitudesFondos, 
    aprobarSolicitudFondo, 
    rechazarSolicitudFondo,
    cancelarSolicitudFondo  
};