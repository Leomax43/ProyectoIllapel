const pool = require('../config/db');

const cambiarEstadoFamilia = async (req, res) => {
    // Capturamos el ID de la familia desde la URL y el nuevo estado desde el body
    const { id_familia } = req.params;
    const { nuevo_estado } = req.body; // Puede ser 'ACTIVO', 'RECHAZADO', 'BAJA'

    try {
        const result = await pool.query(
            'UPDATE familias SET estado = $1 WHERE id_familia = $2 RETURNING rut_representante, nombre_familia, estado',
            [nuevo_estado, id_familia]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'Error', mensaje: 'Familia no encontrada' });
        }

        res.status(200).json({
            status: 'Éxito',
            mensaje: `El estado de la familia se ha actualizado correctamente a ${nuevo_estado}`,
            familia: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al cambiar estado', error: error.message });
    }
};

module.exports = { cambiarEstadoFamilia };