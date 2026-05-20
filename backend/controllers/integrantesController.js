const pool = require('../config/db');

// Agregar un integrante a una familia existente
const agregarIntegrante = async (req, res) => {
    // Recibimos el ID de la familia a la que se sumará el integrante
    const { id_familia } = req.params;
    // Recibimos los datos del nuevo integrante
    const { nombre_completo, rut, parentesco, fecha_nacimiento } = req.body;

    try {
        // Verificamos si la familia existe
        const famRes = await pool.query('SELECT id_familia FROM familias WHERE id_familia = $1', [id_familia]);
        
        if (famRes.rows.length === 0) {
            return res.status(404).json({ status: 'Error', mensaje: 'Familia no encontrada' });
        }

        const result = await pool.query(
            `INSERT INTO integrantes (id_familia, nombre_completo, rut, parentesco, fecha_nacimiento) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [id_familia, nombre_completo, rut, parentesco, fecha_nacimiento]
        );

        res.status(201).json({ 
            status: 'Éxito', 
            mensaje: 'Integrante agregado al núcleo familiar', 
            integrante: result.rows[0] 
        });
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al agregar integrante', error: error.message });
    }
};

// Eliminar un integrante del núcleo familiar
const eliminarIntegrante = async (req, res) => {
    // Recibimos el ID específico del integrante que queremos borrar
    const { id_integrante } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM integrantes WHERE id_integrante = $1 RETURNING *', 
            [id_integrante]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'Error', mensaje: 'Integrante no encontrado' });
        }

        res.status(200).json({ 
            status: 'Éxito', 
            mensaje: 'Integrante eliminado correctamente del sistema',
            integrante_eliminado: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al eliminar integrante', error: error.message });
    }
};

module.exports = { agregarIntegrante, eliminarIntegrante };