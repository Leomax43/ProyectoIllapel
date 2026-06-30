const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



// 1. Login de la Familia en la App
const loginFamilia = async (req, res) => {
    const { rut, clave } = req.body;

    try {
        const result = await pool.query('SELECT * FROM familias WHERE rut_representante = $1', [rut]);

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'Error', mensaje: 'Familia no encontrada en el sistema' });
        }

        const familia = result.rows[0];

        // bcrypt.compare toma la clave en texto plano ("1234") y la compara con el hash de la BD
        const match = await bcrypt.compare(clave, familia.clave_acceso);
        
        if (!match) {
            return res.status(401).json({ status: 'Error', mensaje: 'Clave de acceso incorrecta' });
        }

        if (familia.estado !== 'ACTIVO') {
            return res.status(403).json({ status: 'Error', mensaje: 'Cuenta inactiva. Diríjase a la municipalidad.' });
        }

        // Si todo está bien, le devolvemos sus datos básicos y un token
        res.status(200).json({
            status: 'Éxito',
            mensaje: 'Bienvenido a la Billetera Digital de Illapel',
            usuario: {
                id_familia: familia.id_familia,
                rut_representante: familia.rut_representante,
                nombre_representante: familia.nombre_representante,
                saldo: familia.saldo
            },
            token: "token-simulado-jwt-123456" // En el futuro será un token real
        });

    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error interno del servidor', error: error.message });
    }
};

// 2. Obtener la Cartola (Historial de compras)
const obtenerCartola = async (req, res) => {
    // Recibimos el ID de la familia
    const { id_familia } = req.params;

    try {
        // Hacemos un JOIN con los comercios para que la App muestre el "Nombre del local" 
        // en vez del RUT del local (que sería feo para el usuario).
        const transacciones = await pool.query(`
            SELECT t.id_transaccion, t.monto, t.fecha, t.metodo_pago, c.nombre_comercio 
            FROM transacciones t
            JOIN comercios c ON t.rut_comercio = c.rut_comercio
            WHERE t.id_familia = $1
            ORDER BY t.fecha DESC
        `, [id_familia]);

        res.status(200).json({
            status: 'Éxito',
            total_movimientos: transacciones.rows.length,
            historial: transacciones.rows
        });

    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al obtener la cartola', error: error.message });
    }
};



// 3. Generador de Código QR Temporal (Expira en 5 minutos)
const generarQR = (req, res) => {
    const { id_familia } = req.params;

    try {
        // "Firmamos" un token que contiene el ID de la familia.
        // Usamos una clave secreta (que en producción debería estar en el archivo .env)
        const tokenQR = jwt.sign(
            { id_familia: id_familia }, 
            'secreto_municipal_qr_2026', 
            { expiresIn: '5m' } // Expira exactamente en 5 minutos
        );

        res.status(200).json({
            status: 'Éxito',
            mensaje: 'Código QR generado correctamente',
            qr_data: tokenQR, // Este texto largo es el que la App convierte en el dibujo del QR
            advertencia: 'Este código será inválido en 5 minutos'
        });

    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error al generar QR', error: error.message });
    }
};






module.exports = { loginFamilia, obtenerCartola, generarQR };