const pool = require('../config/db');
const jwt = require('jsonwebtoken');






const realizarTransaccion = async (req, res) => {
    // Recibimos quién compra, dónde compra, cuánto gasta y cómo paga
    const { id_familia, rut_comercio, monto, metodo_pago } = req.body;

    try {
        await pool.query('BEGIN'); // Iniciamos la transacción segura

        // 1. Validar la Familia (¿Existe? ¿Está activa? ¿Tiene saldo suficiente?)
        const famRes = await pool.query('SELECT saldo, estado FROM familias WHERE id_familia = $1', [id_familia]);
        
        if (famRes.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ status: 'Error', mensaje: 'Familia no encontrada' });
        }
        
        const familia = famRes.rows[0];
        
        if (familia.estado !== 'ACTIVO') {
            await pool.query('ROLLBACK');
            return res.status(403).json({ status: 'Error', mensaje: 'La cuenta de la familia no está ACTIVA' });
        }
        
        if (familia.saldo < monto) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ status: 'Error', mensaje: 'Saldo insuficiente para realizar la compra' });
        }

        // 2. Validar el Comercio (¿Existe? ¿Está activo para recibir pagos?)
        const comRes = await pool.query('SELECT estado FROM comercios WHERE rut_comercio = $1', [rut_comercio]);
        
        if (comRes.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ status: 'Error', mensaje: 'Comercio no encontrado' });
        }
        
        if (comRes.rows[0].estado !== 'ACTIVO') {
            await pool.query('ROLLBACK');
            return res.status(403).json({ status: 'Error', mensaje: 'El comercio no está habilitado para recibir pagos' });
        }

        // 3. Descontar el saldo a la familia
        await pool.query('UPDATE familias SET saldo = saldo - $1 WHERE id_familia = $2', [monto, id_familia]);

        // 4. Sumar el saldo al comercio
        await pool.query('UPDATE comercios SET saldo_acumulado = saldo_acumulado + $1 WHERE rut_comercio = $2', [monto, rut_comercio]);

        // 5. Dejar el registro en el historial de transacciones
        await pool.query(
            'INSERT INTO transacciones (id_familia, rut_comercio, monto, metodo_pago) VALUES ($1, $2, $3, $4)',
            [id_familia, rut_comercio, monto, metodo_pago || 'QR'] // Por defecto usamos QR si no se especifica
        );

        // 6. ¡Todo salió perfecto! Guardamos los cambios.
        await pool.query('COMMIT');

        res.status(200).json({ 
            status: 'Éxito', 
            mensaje: 'Transacción aprobada correctamente',
            monto_pagado: monto,
            saldo_restante: familia.saldo - monto 
        });

    } catch (error) {
        await pool.query('ROLLBACK'); // Si algo falla, cancelamos todo el movimiento
        res.status(500).json({ status: 'Error', mensaje: 'Error interno en la transacción', error: error.message });
    }
};





// Nueva función: Cobrar usando el Token del QR
const comprarConQR = async (req, res) => {
    // El comercio envía su RUT, el monto a cobrar y el código gigante que escaneó
    const { rut_comercio, monto, qr_token } = req.body;
    let id_familia;

    // 1. ABRIR EL SOBRE (Validar el QR)
    try {
        const decoded = jwt.verify(qr_token, 'secreto_municipal_qr_2026');
        id_familia = decoded.id_familia; // Extraemos de quién es el código
    } catch (error) {
        // Si el token fue alterado o pasaron los 5 minutos, explota y cae aquí
        return res.status(401).json({ status: 'Error', mensaje: 'El código QR es inválido o ha expirado. Genere uno nuevo.' });
    }

    // 2. PROCESAR EL PAGO (Igual que antes, ahora que sabemos quién es la familia)
    try {
        await pool.query('BEGIN');

        // Validar Familia
        const famRes = await pool.query('SELECT saldo, estado FROM familias WHERE id_familia = $1', [id_familia]);
        if (famRes.rows.length === 0 || famRes.rows[0].estado !== 'ACTIVO' || famRes.rows[0].saldo < monto) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ status: 'Error', mensaje: 'Problemas con la cuenta de la familia o saldo insuficiente' });
        }

        // Validar Comercio
        const comRes = await pool.query('SELECT estado FROM comercios WHERE rut_comercio = $1', [rut_comercio]);
        if (comRes.rows.length === 0 || comRes.rows[0].estado !== 'ACTIVO') {
            await pool.query('ROLLBACK');
            return res.status(400).json({ status: 'Error', mensaje: 'Comercio no habilitado' });
        }

        // Mover dinero y registrar boleta
        await pool.query('UPDATE familias SET saldo = saldo - $1 WHERE id_familia = $2', [monto, id_familia]);
        await pool.query('UPDATE comercios SET saldo_acumulado = saldo_acumulado + $1 WHERE rut_comercio = $2', [monto, rut_comercio]);
        await pool.query(
            'INSERT INTO transacciones (id_familia, rut_comercio, monto, metodo_pago) VALUES ($1, $2, $3, $4)',
            [id_familia, rut_comercio, monto, 'App Movil QR']
        );

        await pool.query('COMMIT');
        
        // Devolvemos el monto cobrado y calculamos el saldo restante
        res.status(200).json({ 
            status: 'Éxito', 
            mensaje: 'Pago con QR aprobado', 
            monto_cobrado: monto,
            saldo_restante: parseInt(famRes.rows[0].saldo) - parseInt(monto) // <-- ESTA ES LA LÍNEA NUEVA
        });

    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({ status: 'Error', mensaje: 'Error en transacción', error: error.message });
    }
};






module.exports = { realizarTransaccion, comprarConQR };