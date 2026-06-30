const pool = require('../config/db');

// Helper para generar nombre_familia con formato "Apellido-ID"
const generarNombreFamilia = (nombre_representante, id_familia) => {
    const apellido = (nombre_representante || '').split(' ').pop() || 'Familia';
    return `${apellido}-${String(id_familia).padStart(2, '0')}`;
};

const obtenerResumen = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const searchTerm = req.query.search || '';
        const offset = (page - 1) * limit;

        let whereClause = '';
        let queryParams = [];
        
        if (searchTerm) {
            whereClause = 'WHERE nombre_representante ILIKE $1 OR rut_representante ILIKE $1';
            queryParams = [`%${searchTerm}%`];
        }

        const primerDiaMes = new Date();
        primerDiaMes.setDate(1);
        primerDiaMes.setHours(0, 0, 0, 0);

        const [activasRes, pendientesRes, comerciosRes, fondosRes, totalFamiliasRes, familiasRes] = await Promise.all([
            pool.query("SELECT COUNT(*) FROM familias WHERE estado = 'ACTIVO'"),
            pool.query("SELECT COUNT(*) FROM familias WHERE estado = 'PENDIENTE'"),
            pool.query("SELECT COUNT(*) FROM comercios WHERE estado = 'ACTIVO'"),
            pool.query("SELECT COALESCE(SUM(monto), 0) as total FROM cargas_fondos WHERE estado = 'APROBADO' AND fecha_solicitud >= $1", [primerDiaMes]),
            pool.query(`SELECT COUNT(*) FROM familias ${whereClause}`, queryParams),
            pool.query(
                `SELECT f.id_familia, f.rut_representante, f.nombre_representante, f.saldo, f.estado, f.fecha_registro, MAX(c.fecha_solicitud) as ultima_carga FROM familias f LEFT JOIN cargas_fondos c ON f.id_familia = c.id_familia AND c.estado = 'APROBADO' ${whereClause.replace('WHERE', 'WHERE') || ''} GROUP BY f.id_familia ORDER BY f.id_familia DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`,
                [...queryParams, limit, offset]
            )
        ]);

        const totalFamilias = parseInt(totalFamiliasRes.rows[0].count);
        const totalPages = Math.ceil(totalFamilias / limit);

        // Mapear familias para incluir nombre_familia computado y fecha_creacion
        const familias = familiasRes.rows.map(f => ({
            ...f,
            nombre_familia: generarNombreFamilia(f.nombre_representante, f.id_familia),
            fecha_creacion: f.fecha_registro
        }));

        res.status(200).json({
            status: 'Éxito',
            indicadores: {
                beneficiariosActivos: parseInt(activasRes.rows[0].count),
                solicitudesPendientes: parseInt(pendientesRes.rows[0].count),
                comerciosRegistrados: parseInt(comerciosRes.rows[0].count),
                fondosCargadosTotales: parseInt(fondosRes.rows[0].total)
            },
            familias,
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
