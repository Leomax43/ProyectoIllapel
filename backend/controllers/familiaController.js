const pool = require('../config/db');
const bcrypt = require('bcrypt');



const crearFamilia = async (req, res) => {
    const { rut_representante, nombre_familia, clave_acceso, direccion, telefono } = req.body;

    try {
        // Encriptamos la clave con un "salt" de 10 rondas (muy seguro y rápido)
        const saltRounds = 10;
        const claveHasheada = await bcrypt.hash(clave_acceso, saltRounds);

        const result = await pool.query(
            `INSERT INTO familias (rut_representante, nombre_familia, direccion, telefono, clave_acceso, estado, saldo) 
             VALUES ($1, $2, $3, $4, $5, 'ACTIVO', 0) RETURNING *`, // <-- Cambiado a ACTIVO
            [rut_representante, nombre_familia, direccion, telefono, claveHasheada]
        );

        res.status(201).json({ status: 'Éxito', mensaje: 'Familia registrada correctamente', familia: result.rows[0] });
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al registrar familia', error: error.message });
    }
};



const obtenerFamilias = async (req, res) => {
    // Capturamos los parámetros de la URL. Si no vienen, por defecto mostramos la página 1 con 8 registros.
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const search = req.query.search || '';
    const estado = req.query.estado || '';

    // Calculamos el desfase (cuántos registros nos saltamos)
    const offset = (page - 1) * limit;

    try {
        let queryText = `
            SELECT 
                f.id_familia,
                f.rut_representante,
                f.nombre_familia,
                f.saldo,
                f.estado,
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

        // 1. Aplicar filtros de búsqueda
        let whereConditions = [];
        
        if (search) {
            whereConditions.push(`(f.nombre_familia ILIKE $${++paramCount} OR f.rut_representante ILIKE $${paramCount})`);
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

        // 2. Obtener el total de elementos que cumplen la condición
        const totalRes = await pool.query(countQueryText, queryParams);
        const totalItems = parseInt(totalRes.rows[0].count);

        // 3. Agrupar por familia y añadir paginación
        queryText += ` GROUP BY f.id_familia ORDER BY f.nombre_familia ASC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
        queryParams.push(limit, offset);

        // Ejecutamos la consulta de datos paginados
        const dataRes = await pool.query(queryText, queryParams);

        // Calculamos el total de páginas necesarias
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            status: 'Éxito',
            paginacion: {
                total_registros: totalItems,
                total_paginas: totalPages,
                pagina_actual: page,
                registros_por_pagina: limit
            },
            familias: dataRes.rows
        });

    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al obtener las familias paginadas', error: error.message });
    }
};

const obtenerFamiliaDetalle = async (req, res) => {
    // Capturamos el RUT desde la URL (ej: /api/familias/12345678-9)
    const { rut } = req.params; 

    try {
        // 1. Buscar los datos base de la familia
        const famRes = await pool.query('SELECT * FROM familias WHERE rut_representante = $1', [rut]);
        
        if (famRes.rows.length === 0) {
            return res.status(404).json({ status: 'Error', mensaje: 'Familia no encontrada' });
        }
        
        const familia = famRes.rows[0];

        // 2. Buscar los integrantes del núcleo familiar usando el ID de la familia
        const intRes = await pool.query('SELECT * FROM integrantes WHERE id_familia = $1', [familia.id_familia]);

        // 3. Buscar el historial de cargas de fondos asociadas a esta familia
        const cargasRes = await pool.query(`
            SELECT c.*, a.nombre_completo as responsable 
            FROM cargas_fondos c 
            JOIN admin a ON c.id_admin = a.id_admin 
            WHERE c.id_familia = $1 
            ORDER BY c.fecha DESC
        `, [familia.id_familia]);

        // 4. Armar el "Expediente Completo"
        res.status(200).json({
            status: 'Éxito',
            datos_personales: familia,
            nucleo_familiar: intRes.rows,
            historial_cargas: cargasRes.rows
        });

    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al obtener el expediente', error: error.message });
    }
};

const subirFichaSocial = async (req, res) => {
    const { id_familia } = req.params;

    // Multer dejará la información del archivo en req.file
    if (!req.file) {
        return res.status(400).json({ status: 'Error', mensaje: 'No se adjuntó ningún archivo PDF' });
    }

    // Armamos la ruta relativa que se guardará en la base de datos
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