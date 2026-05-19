const pool = require('../config/db');

const obtenerResumen = async (req, res) => {
    try {
        // Ejecutamos varias consultas en paralelo para que sea súper rápido
        const [activasRes, pendientesRes, comerciosRes, fondosRes, recientesRes] = await Promise.all([
            pool.query("SELECT COUNT(*) FROM familias WHERE estado = 'ACTIVO'"),
            pool.query("SELECT COUNT(*) FROM familias WHERE estado = 'PENDIENTE'"),
            pool.query("SELECT COUNT(*) FROM comercios WHERE estado = 'ACTIVO'"),
            // COALESCE evita que dé error si aún no hay cargas de fondos (devuelve 0 en vez de null)
            pool.query("SELECT COALESCE(SUM(monto), 0) as total FROM cargas_fondos"),
            // Traemos las últimas 5 familias registradas para la tabla de la vista principal
            pool.query("SELECT id_familia, rut_representante, nombre_familia, saldo, estado FROM familias ORDER BY id_familia DESC LIMIT 5")
        ]);

        // Armamos el "paquete" de respuesta tal como lo necesita el frontend de Carlos
        res.status(200).json({
            status: 'Éxito',
            indicadores: {
                beneficiariosActivos: parseInt(activasRes.rows[0].count),
                solicitudesPendientes: parseInt(pendientesRes.rows[0].count),
                comerciosRegistrados: parseInt(comerciosRes.rows[0].count),
                fondosCargadosTotales: parseInt(fondosRes.rows[0].total)
            },
            ultimosRegistros: recientesRes.rows
        });

    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'No se pudo generar el resumen', error: error.message });
    }
};

module.exports = { obtenerResumen };