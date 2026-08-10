const pool = require('../config/db');

// Helper para generar nombre_familia con formato "Apellido-ID"
const generarNombreFamilia = (nombre_representante, id_familia) => {
    const apellido = (nombre_representante || '').split(' ').pop() || 'Familia';
    return `${apellido}-${String(id_familia).padStart(2, '0')}`;
};

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

        
        const ultimasCargas = await pool.query(`
            SELECT fecha_solicitud FROM cargas_fondos 
            WHERE id_familia = $1 AND estado = 'APROBADO' AND fecha_solicitud >= NOW() - INTERVAL '30 days'
        `, [id_familia]);

        if (ultimasCargas.rows.length > 0) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ status: 'Error', mensaje: 'Bloqueo: Ya recibió fondos en los últimos 30 días.' });
        }
        
        
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

const obtenerCargas = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const search = req.query.search || '';
    const estado = req.query.estado || '';

    const offset = (page - 1) * limit;

    try {
        let whereConditions = [];
        let queryParams = [];
        let paramCount = 0;

        if (search) {
            whereConditions.push(`(f.nombre_representante ILIKE $${++paramCount} OR f.rut_representante ILIKE $${paramCount} OR c.motivo ILIKE $${paramCount})`);
            queryParams.push(`%${search}%`);
        }

        if (estado && estado !== 'TODOS') {
            whereConditions.push(`c.estado = $${++paramCount}`);
            queryParams.push(estado);
        }

        const whereClause = whereConditions.length > 0 ? ' WHERE ' + whereConditions.join(' AND ') : '';

        const countRes = await pool.query(
            `SELECT COUNT(*) FROM cargas_fondos c JOIN familias f ON c.id_familia = f.id_familia${whereClause}`,
            queryParams
        );
        const totalItems = parseInt(countRes.rows[0].count);

        const dataRes = await pool.query(
            `SELECT 
                c.id_carga, c.id_familia, c.monto, c.motivo, c.detalles, c.estado,
                c.fecha_solicitud, c.fecha_aprobacion, c.pdf_resolucion,
                f.rut_representante, f.nombre_representante, f.saldo,
                a.nombre_completo as responsable
            FROM cargas_fondos c
            JOIN familias f ON c.id_familia = f.id_familia
            LEFT JOIN admin a ON c.id_admin = a.id_admin
            ${whereClause}
            ORDER BY c.fecha_solicitud DESC
            LIMIT $${++paramCount} OFFSET $${++paramCount}`,
            [...queryParams, limit, offset]
        );

        const cargas = dataRes.rows.map(c => ({
            ...c,
            fecha: c.fecha_solicitud,
            nombre_familia: generarNombreFamilia(c.nombre_representante, c.id_familia)
        }));

        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            status: 'Éxito',
            paginacion: {
                total_registros: totalItems,
                total_paginas: totalPages,
                pagina_actual: page,
                registros_por_pagina: limit
            },
            cargas
        });

    } catch (error) {
        console.error("Error en obtenerCargas:", error);
        res.status(500).json({ status: 'Error', mensaje: 'Error al obtener las cargas de fondos', error: error.message });
    }
};

module.exports = { cargarFondos, obtenerCargas };