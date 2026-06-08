const pool = require('../config/db');

const obtenerResumen = async (req, res) => {
    try {
        // Obtener página, límite y búsqueda de query params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const searchTerm = req.query.search || '';
        const offset = (page - 1) * limit;

        // Construir condición WHERE si hay término de búsqueda
        let whereClause = '';
        let queryParams = [];
        
        if (searchTerm) {
            whereClause = 'WHERE nombre_familia ILIKE $1 OR rut_representante ILIKE $1';
            queryParams = [`%${searchTerm}%`];
        }

        // Ejecutamos varias consultas en paralelo para que sea súper rápido
        const [activasRes, pendientesRes, comerciosRes, fondosRes, totalFamiliasRes, familiasRes] = await Promise.all([
            pool.query("SELECT COUNT(*) FROM familias WHERE estado = 'ACTIVO'"),
            pool.query("SELECT COUNT(*) FROM familias WHERE estado = 'PENDIENTE'"),
            pool.query("SELECT COUNT(*) FROM comercios WHERE estado = 'ACTIVO'"),
            // COALESCE evita que dé error si aún no hay cargas de fondos (devuelve 0 en vez de null)
            pool.query("SELECT COALESCE(SUM(monto), 0) as total FROM cargas_fondos WHERE estado = 'APROBADO'"),            // Contar familias con el filtro de búsqueda
            pool.query(`SELECT COUNT(*) FROM familias ${whereClause}`, queryParams),
            // Traemos las familias con paginación y búsqueda
            pool.query(
                `SELECT id_familia, rut_representante, nombre_familia, saldo, estado FROM familias ${whereClause} ORDER BY id_familia DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`,
                [...queryParams, limit, offset]
            )
        ]);

        const totalFamilias = parseInt(totalFamiliasRes.rows[0].count);
        const totalPages = Math.ceil(totalFamilias / limit);

        // Armamos el "paquete" de respuesta
        res.status(200).json({
            status: 'Éxito',
            indicadores: {
                beneficiariosActivos: parseInt(activasRes.rows[0].count),
                solicitudesPendientes: parseInt(pendientesRes.rows[0].count),
                comerciosRegistrados: parseInt(comerciosRes.rows[0].count),
                fondosCargadosTotales: parseInt(fondosRes.rows[0].total)
            },
            familias: familiasRes.rows,
            paginacion: {
                paginaActual: page,
                totalPaginas: totalPages,
                totalRegistros: totalFamilias,
                registrosPorPagina: limit,
                busqueda: searchTerm || null
            }
        });

    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'No se pudo generar el resumen', error: error.message });
    }
};

module.exports = { obtenerResumen };