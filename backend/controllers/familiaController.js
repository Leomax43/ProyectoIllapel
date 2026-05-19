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
             VALUES ($1, $2, $3, $4, $5, 'PENDIENTE', 0) RETURNING *`,
            [rut_representante, nombre_familia, direccion, telefono, claveHasheada] // <-- GUARDAMOS EL HASH
        );

        res.status(201).json({ status: 'Éxito', mensaje: 'Familia registrada correctamente', familia: result.rows[0] });
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al registrar familia', error: error.message });
    }
};



const obtenerFamilias = async (req, res) => {
    // Capturamos los parámetros de la URL. Si no vienen, por defecto mostramos la página 1 con 50 registros.
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || '';

    // Calculamos el desfase (cuántos registros nos saltamos)
    // Ejemplo: Página 1 -> (1-1)*50 = 0 (se salta 0). Página 2 -> (2-1)*50 = 50 (se salta los primeros 50).
    const offset = (page - 1) * limit;

    try {
        let queryText = 'SELECT * FROM familias';
        let countQueryText = 'SELECT COUNT(*) FROM familias';
        let queryParams = [];

        // 1. Si el usuario escribió algo en el buscador, aplicamos el filtro por RUT
        if (search) {
            queryText += ' WHERE rut_representante ILIKE $1';
            countQueryText += ' WHERE rut_representante ILIKE $1';
            queryParams.push(`%${search}%`); // El '%' permite coincidencias parciales (ej: escribir "987" y encontrar "9876543-2")
        }

        // 2. Obtener el total de elementos que cumplen la condición (necesario para calcular las páginas totales)
        const totalRes = await pool.query(countQueryText, queryParams);
        const totalItems = parseInt(totalRes.rows[0].count);

        // 3. Añadimos el ordenamiento y los controles de paginación a la consulta final
        const numParametros = queryParams.length;
        queryText += ` ORDER BY nombre_familia ASC LIMIT $${numParametros + 1} OFFSET $${numParametros + 2}`;
        
        // Agregamos el limit y el offset al arreglo de parámetros
        queryParams.push(limit, offset);

        // Ejecutamos la consulta de datos paginados
        const dataRes = await pool.query(queryText, queryParams);

        // Calculamos el total de páginas necesarias
        const totalPages = Math.ceil(totalItems / limit);

        // Devolvemos una estructura meta-data muy limpia para que el Frontend dibuje la paginación fácilmente
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

module.exports = { crearFamilia, obtenerFamilias, obtenerFamiliaDetalle, subirFichaSocial };