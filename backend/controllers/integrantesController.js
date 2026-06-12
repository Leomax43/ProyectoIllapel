const pool = require('../config/db');

// Agregar un integrante a una familia existente
const agregarIntegrante = async (req, res) => {
    // Obtenemos el id desde la URL
    const { id_familia } = req.params;
    
    // 1. Extraemos las variables (el orden aquí no importa)
    const { nombre_completo, rut, parentesco, fecha_nacimiento, tiene_discapacidad } = req.body;

    try {
        // 2. TU CÓDIGO: Verificamos si la familia existe ANTES de hacer nada
        const famRes = await pool.query('SELECT id_familia FROM familias WHERE id_familia = $1', [id_familia]);
        
        if (famRes.rows.length === 0) {
            return res.status(404).json({ status: 'Error', mensaje: 'Familia no encontrada' });
        }

        // 3. Nos aseguramos de que se guarde como un booleano (true/false)
        const discapacidadValor = tiene_discapacidad === true || tiene_discapacidad === 'true';

        // 4. Insertamos respetando el orden estricto de los $1, $2, etc.
        const result = await pool.query(
            `INSERT INTO integrantes 
            (id_familia, nombre_completo, rut, parentesco, fecha_nacimiento, tiene_discapacidad) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [id_familia, nombre_completo, rut, parentesco, fecha_nacimiento, discapacidadValor]
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