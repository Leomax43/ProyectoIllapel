const pool = require('../config/db');

const cargarFondos = async (req, res) => {
    // El id_familia viene por la URL (:id_familia) y el resto por el body (Form-Data)
    const { id_familia } = req.params;
    const { id_admin, monto, motivo, observaciones } = req.body;

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
        // Nota: Añadimos "estado = 'APROBADO'" para que solo bloquee si la jefatura ya la aceptó antes
        /*
        const ultimasCargas = await pool.query(`
            SELECT fecha FROM cargas_fondos 
            WHERE id_familia = $1 AND estado = 'APROBADO' AND fecha >= NOW() - INTERVAL '30 days'
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
        
        // 2. Registrar la carga en el historial con estado 'PENDIENTE' e id_jefatura en NULL
        // Modificamos el INSERT para incluir las nuevas columnas de la base de datos de aprobaciones
        const result = await pool.query(
            `INSERT INTO cargas_fondos (id_familia, id_admin, id_jefatura, monto, motivo, detalles, estado, pdf_resolucion) 
             VALUES ($1, $2, NULL, $3, $4, $5, 'PENDIENTE', $6) RETURNING *`,
            [id_familia, id_admin, monto, motivo || null, observaciones || null, pdfResolucionPath]
        );

        // 3. ¡ELIMINADO! 
        // Ya no ejecutamos el UPDATE para sumarle dinero a la familia de forma inmediata aquí.
        // Esa acción ahora se traslada al aprobacionesController para cuando la Jefatura presione el botón.

        await pool.query('COMMIT');

        // Modificamos la respuesta para avisar al frontend que quedó en espera, sin devolver un "nuevo_saldo"
        res.status(202).json({ 
            status: 'Éxito', 
            mensaje: 'Solicitud de fondos registrada correctamente. Queda en bandeja de aprobación de Jefatura.', 
            solicitud: result.rows[0],
            documento_adjunto: pdfResolucionPath ? 'Guardado' : 'Ninguno'
        });

    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({ status: 'Error', mensaje: 'Error interno al procesar la solicitud de fondos', error: error.message });
    }
};

module.exports = { cargarFondos };