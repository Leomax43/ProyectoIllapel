const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// 1. Login Unificado (Familias y Comercios)
const loginMovil = async (req, res) => {
    const { rut, clave } = req.body;

    // Normalizar RUT: quitar puntos y espacios, K mayúscula
    const normalizarRut = (r) => {
        if (!r) return '';
        return r.replace(/\./g, '').replace(/\s/g, '').toUpperCase();
    };
    const rutNormalizado = normalizarRut(rut);

    try {
        // --- A. INTENTAR COMO FAMILIA ---
        const famRes = await pool.query(
            "SELECT * FROM familias WHERE REPLACE(UPPER(rut_representante), '.', '') = $1",
            [rutNormalizado]
        );
        if (famRes.rows.length > 0) {
            const familia = famRes.rows[0];
            const match = await bcrypt.compare(clave, familia.clave_acceso);
            
            if (!match) return res.status(401).json({ status: 'Error', mensaje: 'Clave de acceso incorrecta' });
            if (familia.estado !== 'ACTIVO') return res.status(403).json({ status: 'Error', mensaje: 'Cuenta inactiva.' });

            return res.status(200).json({
                status: 'Éxito',
                usuario: {
                    rol: 'FAMILIA', // <-- El Semáforo lo detectará
                    id_familia: familia.id_familia,
                    rut_representante: familia.rut_representante,
                    nombre_familia: familia.nombre_representante,
                    saldo: familia.saldo
                },
                token: "token-simulado-jwt-123456" 
            });
        }

        // --- B. INTENTAR COMO COMERCIO ---

        if (comRes.rows.length > 0) {
            const comercio = comRes.rows[0];
            
            // ATENCIÓN: Esto requiere que la tabla comercios tenga la columna 'clave_acceso'
            const match = await bcrypt.compare(clave, comercio.clave_acceso);
            
            if (!match) return res.status(401).json({ status: 'Error', mensaje: 'Clave de acceso incorrecta' });
            if (comercio.estado !== 'ACTIVO') return res.status(403).json({ status: 'Error', mensaje: 'Comercio inactivo.' });

            return res.status(200).json({
                status: 'Éxito',
                usuario: {
                    rol: 'COMERCIO', // <-- El Semáforo lo detectará
                    rut_comercio: comercio.rut_comercio,
                    nombre_comercio: comercio.nombre_comercio,
                    saldo_acumulado: comercio.saldo_acumulado
                },
                token: "token-simulado-jwt-123456" 
            });
        }

        // --- C. NO EXISTE EN NINGÚN LADO ---
        return res.status(404).json({ status: 'Error', mensaje: 'El RUT ingresado no está registrado en el sistema.' });

    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error interno del servidor', error: error.message });
    }
}

// 2. Obtener la Cartola (Historial de compras) + Saldo actual
const obtenerCartola = async (req, res) => {
    // Recibimos el ID de la familia
    const { id_familia } = req.params;

    try {
        // Obtener saldo actual de la familia
        const familiaRes = await pool.query(
            'SELECT saldo, nombre_representante FROM familias WHERE id_familia = $1',
            [id_familia]
        );

        if (familiaRes.rows.length === 0) {
            return res.status(404).json({ status: 'Error', mensaje: 'Familia no encontrada' });
        }

        const { saldo, nombre_representante } = familiaRes.rows[0];

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
            saldo_actual: saldo,
            nombre_familia: nombre_representante,
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






module.exports = { loginMovil, obtenerCartola, generarQR };