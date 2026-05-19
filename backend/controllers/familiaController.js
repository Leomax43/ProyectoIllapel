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
module.exports = { crearFamilia, obtenerFamilias, obtenerFamiliaDetalle };