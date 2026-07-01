const pool = require('../config/db');

const asegurarColumnasIntegrantes = async () => {
    await pool.query(`
        ALTER TABLE integrantes
        ADD COLUMN IF NOT EXISTS sexo VARCHAR(20),
        ADD COLUMN IF NOT EXISTS correo_electronico VARCHAR(150),
        ADD COLUMN IF NOT EXISTS telefono VARCHAR(20),
        ADD COLUMN IF NOT EXISTS tiene_discapacidad BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS observaciones TEXT;
    `);
};

// Agregar un integrante a una familia existente
const agregarIntegrante = async (req, res) => {
    const { id_familia } = req.params;
    const {
        nombre_completo,
        rut,
        parentesco,
        fecha_nacimiento,
        sexo,
        correo_electronico,
        telefono,
        tiene_discapacidad,
        observaciones
    } = req.body;

    try {
        await asegurarColumnasIntegrantes();

        const famRes = await pool.query('SELECT id_familia FROM familias WHERE id_familia = $1', [id_familia]);

        if (famRes.rows.length === 0) {
            return res.status(404).json({ status: 'Error', mensaje: 'Familia no encontrada' });
        }

        const discapacidadValor = tiene_discapacidad === true || tiene_discapacidad === 'true';

        const result = await pool.query(
            `INSERT INTO integrantes (
                id_familia,
                nombre_completo,
                rut,
                parentesco,
                sexo,
                fecha_nacimiento,
                correo_electronico,
                telefono,
                tiene_discapacidad,
                observaciones
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [id_familia, nombre_completo, rut || null, parentesco || null, sexo || null, fecha_nacimiento || null, correo_electronico || null, telefono || null, discapacidadValor, observaciones || null]
        );

        res.status(201).json({
            status: 'Éxito',
            mensaje: 'Integrante agregado correctamente',
            integrante: result.rows[0]
        });

    } catch (error) {
        console.error("Error al agregar integrante:", error);
        res.status(500).json({ status: 'Error', mensaje: 'Error interno del servidor', error: error.message });
    }
};

// Eliminar un integrante del núcleo familiar
const eliminarIntegrante = async (req, res) => {
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