const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Helper para generar nombre_familia con formato "Apellido-ID"
const generarNombreFamilia = (nombre_representante, id_familia) => {
    const apellido = (nombre_representante || '').split(' ').pop() || 'Familia';
    return `${apellido}-${String(id_familia).padStart(2, '0')}`;
};

const crearFamilia = async (req, res) => {
    // Aceptar tanto nombre_representante como nombre_familia (para compatibilidad con frontend)
    const nombre_representante = req.body.nombre_representante || req.body.nombre_familia || 'Familia';
    const { rut_representante, clave_acceso, direccion, telefono } = req.body;

    try {
        const checkRes = await pool.query('SELECT rut_representante FROM familias WHERE rut_representante = $1', [rut_representante]);
        if (checkRes.rows.length > 0) {
            return res.status(400).json({ status: 'Error', mensaje: 'La familia ya está registrada con este RUT.' });
        }

        const saltRounds = 10;
        const claveHasheada = await bcrypt.hash(clave_acceso, saltRounds);

        const result = await pool.query(
            `INSERT INTO familias (rut_representante, nombre_representante, direccion, telefono, clave_acceso, estado, saldo) 
             VALUES ($1, $2, $3, $4, $5, 'ACTIVO', 0) RETURNING *`, 
            [rut_representante, nombre_representante, direccion, telefono, claveHasheada]
        );

        const familia = result.rows[0];
        
        // Añadir nombre_familia computado para el frontend
        familia.nombre_familia = generarNombreFamilia(familia.nombre_representante, familia.id_familia);
        familia.fecha_creacion = familia.fecha_registro;

        res.status(201).json({ status: 'Éxito', mensaje: 'Familia registrada correctamente', familia });
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al registrar familia', error: error.message });
    }
};

const obtenerFamilias = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const search = req.query.search || '';
    const estado = req.query.estado || '';

    const offset = (page - 1) * limit;

    try {
        let queryText = `
            SELECT 
                f.id_familia,
                f.rut_representante,
                f.nombre_representante,
                f.saldo,
                f.estado,
                f.fecha_registro,
                f.pdf_ficha_social,
                COUNT(i.id_integrante) as total_integrantes
            FROM familias f
            LEFT JOIN integrantes i ON f.id_familia = i.id_familia
        `;
        let countQueryText = `
            SELECT COUNT(DISTINCT f.id_familia) FROM familias f
        `;
        let queryParams = [];
        let paramCount = 0;

        let whereConditions = [];
        
        if (search) {
            whereConditions.push(`(f.nombre_representante ILIKE $${++paramCount} OR f.rut_representante ILIKE $${paramCount})`);
            queryParams.push(`%${search}%`);
        }

        if (estado) {
            whereConditions.push(`f.estado = $${++paramCount}`);
            queryParams.push(estado);
        }

        if (whereConditions.length > 0) {
            const whereClause = ' WHERE ' + whereConditions.join(' AND ');
            queryText += whereClause;
            countQueryText += whereClause;
        }

        const totalRes = await pool.query(countQueryText, queryParams);
        const totalItems = parseInt(totalRes.rows[0].count);

        queryText += ` GROUP BY f.id_familia ORDER BY f.nombre_representante ASC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
        queryParams.push(limit, offset);

        const dataRes = await pool.query(queryText, queryParams);

        // Mapear para incluir nombre_familia computado y alias de fechas
        const familias = dataRes.rows.map(f => ({
            ...f,
            nombre_familia: generarNombreFamilia(f.nombre_representante, f.id_familia),
            fecha_creacion: f.fecha_registro
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
            familias
        });

    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al obtener las familias paginadas', error: error.message });
    }
};

const obtenerFamiliaDetalle = async (req, res) => {
    const { rut } = req.params; 

    try {
        const famRes = await pool.query('SELECT * FROM familias WHERE rut_representante = $1', [rut]);
        
        if (famRes.rows.length === 0) {
            return res.status(404).json({ status: 'Error', mensaje: 'Familia no encontrada' });
        }
        
        const familiaBase = famRes.rows[0];

        const intRes = await pool.query('SELECT * FROM integrantes WHERE id_familia = $1', [familiaBase.id_familia]);

        const cargasRes = await pool.query(`
            SELECT c.*, a.nombre_completo as responsable 
            FROM cargas_fondos c 
            JOIN admin a ON c.id_admin = a.id_admin 
            WHERE c.id_familia = $1 
            ORDER BY c.fecha_solicitud DESC 
        `, [familiaBase.id_familia]);

        // Mapear cargas para incluir campo 'fecha' (alias de fecha_solicitud)
        const historial_cargas = cargasRes.rows.map(c => ({
            ...c,
            fecha: c.fecha_solicitud
        }));

        // Construir datos_personales con nombre_familia computado y fecha_creacion
        const datos_personales = {
            ...familiaBase,
            nombre_familia: generarNombreFamilia(familiaBase.nombre_representante, familiaBase.id_familia),
            fecha_creacion: familiaBase.fecha_registro
        };

        res.status(200).json({
            status: 'Éxito',
            datos_personales,
            nucleo_familiar: intRes.rows,
            historial_cargas
        });

    } catch (error) {
        console.error("Error en obtenerFamiliaDetalle:", error);
        res.status(500).json({ status: 'Error', mensaje: 'Error al obtener el expediente', error: error.message });
    }
};

const subirFichaSocial = async (req, res) => {
    const { id_familia } = req.params;

    if (!req.file) {
        return res.status(400).json({ status: 'Error', mensaje: 'No se adjuntó ningún archivo PDF' });
    }

    const rutaBd = `/archivosDocumentos/familias/${id_familia}/${req.file.filename}`;

    try {
        await pool.query(
            'UPDATE familias SET pdf_ficha_social = $1 WHERE id_familia = $2',
            [rutaBd, id_familia]
        );

        res.status(200).json({
            status: 'Éxito',
            mensaje: 'Ficha Social subida y asociada correctamente',
            ruta_archivo: rutaBd
        });
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al actualizar la base de datos', error: error.message });
    }
};

const obtenerEstadisticasBeneficiarios = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN estado = 'ACTIVO' THEN 1 END) as activos,
                COUNT(CASE WHEN estado = 'PENDIENTE' THEN 1 END) as pendientes,
                COUNT(CASE WHEN estado = 'BAJA' THEN 1 END) as bajas
            FROM familias
        `);

        const stats = result.rows[0];

        res.status(200).json({
            status: 'Éxito',
            datos: {
                total_registrados: parseInt(stats.total),
                activos: parseInt(stats.activos),
                pendientes: parseInt(stats.pendientes),
                bajas: parseInt(stats.bajas)
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al obtener estadísticas', error: error.message });
    }
};

module.exports = { crearFamilia, obtenerFamilias, obtenerFamiliaDetalle, subirFichaSocial, obtenerEstadisticasBeneficiarios };