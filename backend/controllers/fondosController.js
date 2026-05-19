const pool = require('../config/db');

const cargarFondos = async (req, res) => {
    // Ahora el id_familia viene por la URL (:id_familia) y el resto por el body (Form-Data)
    const { id_familia } = req.params;
    const { id_admin, monto } = req.body;

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

        // voy a dejar el requisito de los 30 dias comentado para hacer pruebas
        /*
        const ultimasCargas = await pool.query(`
            SELECT fecha FROM cargas_fondos 
            WHERE id_familia = $1 AND fecha >= NOW() - INTERVAL '30 days'
        `, [id_familia]);

        if (ultimasCargas.rows.length > 0) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ status: 'Error', mensaje: 'Bloqueo: Ya recibió fondos en los últimos 30 days.' });
        }
        */


        
        // voy a dejar esto tambien comentado para no necesitar de un pdf para añadir dinero
        let pdfResolucionPath = null;

        /*
        if (req.file) {
            pdfResolucionPath = `/archivosDocumentos/familias/${id_familia}/${req.file.filename}`;
        } else {
            await pool.query('ROLLBACK');
            return res.status(400).json({ status: 'Error', mensaje: 'No se adjuntó el PDF de la resolución municipal' });
        }
        */
        

        // 2. Registrar la carga en el historial (incluyendo la columna del PDF)
        await pool.query(
            'INSERT INTO cargas_fondos (id_familia, id_admin, monto, pdf_resolucion) VALUES ($1, $2, $3, $4)',
            [id_familia, id_admin, monto, pdfResolucionPath]
        );

        // 3. Actualizar el saldo de la familia
        await pool.query(
            'UPDATE familias SET saldo = saldo + $1 WHERE id_familia = $2',
            [monto, id_familia]
        );

        await pool.query('COMMIT');

        res.status(200).json({ 
            status: 'Éxito', 
            mensaje: 'Fondos cargados correctamente', 
            nuevo_saldo: parseInt(familia.saldo) + parseInt(monto),
            documento_adjunto: pdfResolucionPath ? 'Guardado' : 'Ninguno (Modo Prueba)'
        });

    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({ status: 'Error', mensaje: 'Error interno al cargar fondos', error: error.message });
    }
};

module.exports = { cargarFondos };