const pool = require('../config/db');

const CAMPOS_EXCLUIDOS = ['clave', 'clave_acceso', 'password', 'token'];

const TABLAS_PERMITIDAS = [
    'admin',
    'familias',
    'integrantes',
    'comercios',
    'cargas_fondos',
    'subrogaciones',
    'transacciones'
];

// Función para filtrar campos sensibles de una fila
const filtrarCamposSensibles = (fila) => {
    const filaLimpia = {};
    for (const [key, value] of Object.entries(fila)) {
        if (!CAMPOS_EXCLUIDOS.includes(key.toLowerCase())) {
            filaLimpia[key] = value;
        }
    }
    return filaLimpia;
};

// Función para filtrar un array de filas
const filtrarFilas = (filas) => filas.map(filtrarCamposSensibles);

// Obtener columnas visibles (sin campos excluidos)
const obtenerColumnasVisibles = (columnas) => 
    columnas.filter(col => !CAMPOS_EXCLUIDOS.includes(col.toLowerCase()));

// Obtener datos de una tabla específica
const obtenerDatosTabla = async (req, res) => {
    const { tabla } = req.params;

    if (!TABLAS_PERMITIDAS.includes(tabla)) {
        return res.status(400).json({ mensaje: 'Tabla no válida' });
    }

    try {
        const result = await pool.query(`SELECT * FROM ${tabla} ORDER BY 1 DESC`);
        res.status(200).json({ datos: filtrarFilas(result.rows) });
    } catch (error) {
        console.error(`Error al obtener datos de ${tabla}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Obtener vista previa (primeros 5 registros) de una tabla
const obtenerVistaPrevia = async (req, res) => {
    const { tabla } = req.params;

    if (!TABLAS_PERMITIDAS.includes(tabla)) {
        return res.status(400).json({ mensaje: 'Tabla no válida' });
    }

    try {
        const result = await pool.query(`SELECT * FROM ${tabla} ORDER BY 1 DESC LIMIT 5`);
        res.status(200).json({ datos: filtrarFilas(result.rows) });
    } catch (error) {
        console.error(`Error al obtener vista previa de ${tabla}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Obtener lista de tablas disponibles
const obtenerTablas = async (req, res) => {
    res.status(200).json({ tablas: TABLAS_PERMITIDAS });
};

module.exports = { obtenerDatosTabla, obtenerVistaPrevia, obtenerTablas };