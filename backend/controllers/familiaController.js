const pool = require('../config/db');

const crearFamilia = async (req, res) => {
    const { rut_representante, nombre_familia, clave_acceso } = req.body;
    try {
        // Inserta la familia e inicia el saldo en 0
        const result = await pool.query(
            'INSERT INTO familias (rut_representante, nombre_familia, clave_acceso, saldo) VALUES ($1, $2, $3, 0) RETURNING *',
            [rut_representante, nombre_familia, clave_acceso]
        );
        res.status(201).json({ status: 'Éxito', mensaje: 'Familia registrada correctamente', familia: result.rows[0] });
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al registrar familia', error: error.message });
    }
};

const obtenerFamilias = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM familias');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al obtener familias', error: error.message });
    }
};

module.exports = { crearFamilia, obtenerFamilias };