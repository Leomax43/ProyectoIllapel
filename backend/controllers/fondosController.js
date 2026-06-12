const pool = require('../config/db');

const cargarFondos = async (req, res) => {
    // El id_familia viene por la URL (:id_familia) y el resto por el body (Form-Data)
    const { id_familia } = req.params;
    const { id_admin, monto, motivo, observaciones, dias_validez } = req.body;

    try {
        await pool.query('BEGIN'); // Transacción segura

        // 1. Verificar que la familia exista y esté ACTIVA
        const famRes = await pool.query('SELECT saldo, estado FROM familias WHERE id_familia = $1', [id_familia]);
        
        if (famRes.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ status: 'Error', mensaje: 'Familia no encontrada' });
        }

        const familia = famRes.rows[0];
        
        if (familia.estado !== 'ACTIVO') {
            await pool.query('ROLLBACK');
            return res.status(403).json({ status: 'Error', mensaje: 'La cuenta no está ACTIVA' });
        }

        // Requisito de los 30 días (comentado para pruebas según lo solicitado)
        /*
        const ultimasCargas = await pool.query(`
            SELECT fecha_solicitud FROM cargas_fondos 
            WHERE id_familia = $1 AND estado = 'APROBADO' AND fecha_solicitud >= NOW() - INTERVAL '30 days'
        `, [id_familia]);

        if (ultimasCargas.rows.length > 0) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ status: 'Error', mensaje: 'Bloqueo: Ya recibió fondos en los últimos 30 días.' });
        }
        */
        
        // Guardar PDF si se adjunta desde el formulario del Frontend
        let pdfResolucionPath = null;

        if (req.file) {
            pdfResolucionPath = `/archivosDocumentos/familias/${id_familia}/${req.file.filename}`;
        }

        // 2. Definimos los días de validez (por defecto 7 si el Frontend no envía nada)
        const validez = dias_validez ? parseInt(dias_validez) : 7;
        
        // 3. Registrar la carga en el historial con estado 'PENDIENTE', id_jefatura en NULL y los días de validez
        const result = await pool.query(
            `INSERT INTO cargas_fondos (id_familia, id_admin, id_jefatura, monto, motivo, detalles, estado, pdf_resolucion, dias_validez) 
             VALUES ($1, $2, NULL, $3, $4, $5, 'PENDIENTE', $6, $7) RETURNING *`,
            [id_familia, id_admin, monto, motivo || null, observaciones || null, pdfResolucionPath, validez]
        );

        // No sumamos dinero aquí, esto se hace en aprobacionesController

        await pool.query('COMMIT');

        // Modificamos la respuesta para avisar al frontend que quedó en espera
        res.status(202).json({ 
            status: 'Éxito', 
            mensaje: 'Solicitud de fondos registrada correctamente. Queda en bandeja de aprobación de Jefatura.', 
            solicitud: result.rows[0],
            documento_adjunto: pdfResolucionPath ? 'Guardado' : 'Ninguno'
        });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Error en cargarFondos:", error);
        res.status(500).json({ status: 'Error', mensaje: 'Error interno al procesar la solicitud de fondos', error: error.message });
    }
};

module.exports = { cargarFondos };