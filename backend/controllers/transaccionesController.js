const pool = require('../config/db');
const jwt = require('jsonwebtoken');

// Nueva función: Obtener métricas del mes actual
const obtenerMetricas = async (req, res) => {
    try {
        // Obtener el primer y último día del mes actual
        const ahora = new Date();
        const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        const ultimoDiaMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59);

        // 1. Total de transacciones este mes (Aplica a tabla transacciones, 'fecha' es correcto)
        const transaccionesRes = await pool.query(
            `SELECT COUNT(*) as total FROM transacciones 
             WHERE fecha >= $1 AND fecha <= $2`,
            [primerDiaMes, ultimoDiaMes]
        );
        const totalTransacciones = parseInt(transaccionesRes.rows[0].total);

        // 2. Total fondos cargados este mes (Aplica a cargas_fondos, CORREGIDO a 'fecha_solicitud')
        const fondosCargadosRes = await pool.query(
            `SELECT COALESCE(SUM(monto), 0) as total FROM cargas_fondos 
             WHERE fecha_solicitud >= $1 AND fecha_solicitud <= $2 AND estado = 'APROBADO'`,
            [primerDiaMes, ultimoDiaMes]
        );
        const totalFondosCargados = parseInt(fondosCargadosRes.rows[0].total);

        // 3. Total cargas realizadas (Aplica a cargas_fondos, CORREGIDO a 'fecha_solicitud')
        const totalCargasRes = await pool.query(
            `SELECT COUNT(*) as total FROM cargas_fondos 
             WHERE fecha_solicitud >= $1 AND fecha_solicitud <= $2`,
            [primerDiaMes, ultimoDiaMes]
        );
        const totalCargas = parseInt(totalCargasRes.rows[0].total);

        // 4. Total pagos procesados (solo transacciones, no cargas)
        const pagosRes = await pool.query(
            `SELECT COALESCE(SUM(monto), 0) as total FROM transacciones 
             WHERE fecha >= $1 AND fecha <= $2 AND metodo_pago IS NOT NULL AND metodo_pago != ''`,
            [primerDiaMes, ultimoDiaMes]
        );
        const totalPagos = parseInt(pagosRes.rows[0].total);

        // 5. Pagos por RUT+PIN
        const pagosRutPinRes = await pool.query(
            `SELECT COUNT(*) as total FROM transacciones 
             WHERE fecha >= $1 AND fecha <= $2 AND metodo_pago ILIKE '%PIN%'`,
            [primerDiaMes, ultimoDiaMes]
        );
        const pagosRutPin = parseInt(pagosRutPinRes.rows[0].total);

        // 6. Pagos por QR
        const pagosQrRes = await pool.query(
            `SELECT COUNT(*) as total FROM transacciones 
             WHERE fecha >= $1 AND fecha <= $2 AND metodo_pago ILIKE '%QR%'`,
            [primerDiaMes, ultimoDiaMes]
        );
        const pagosQr = parseInt(pagosQrRes.rows[0].total);

        const mesActual = ahora.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });

        res.status(200).json({
            status: 'Éxito',
            metricas: {
                totalTransacciones,
                mesActual,
                totalFondosCargados,
                totalCargas,
                totalPagos,
                pagosRutPin,
                pagosQr
            }
        });

    } catch (error) {
        console.error('❌ Error en obtenerMetricas:', error);
        res.status(500).json({ status: 'Error', mensaje: 'Error al obtener métricas', error: error.message });
    }
};

// Nueva función: Obtener todas las transacciones con filtros
const obtenerTransacciones = async (req, res) => {
    const { tipo, rut_comercio, id_familia } = req.query;
    
    try {
        let query = `
            SELECT 
                t.id_transaccion,
                t.id_familia,
                f.rut_representante,
                f.nombre_familia,
                t.rut_comercio,
                c.nombre_comercio,
                t.monto,
                t.metodo_pago,
                t.fecha,
                f.saldo
            FROM transacciones t
            LEFT JOIN familias f ON t.id_familia = f.id_familia
            LEFT JOIN comercios c ON t.rut_comercio = c.rut_comercio
            WHERE 1=1
        `;
        const params = [];
        let paramCount = 1;

        // Filtro por tipo de pago
        if (tipo && tipo !== 'todos') {
            query += ` AND t.metodo_pago ILIKE $${paramCount}`;
            params.push(`%${tipo}%`);
            paramCount++;
        }

        // Filtro por comercio
        if (rut_comercio && rut_comercio !== 'todos') {
            query += ` AND t.rut_comercio = $${paramCount}`;
            params.push(rut_comercio);
            paramCount++;
        }

        // Filtro por familia
        if (id_familia) {
            query += ` AND t.id_familia = $${paramCount}`;
            params.push(id_familia);
            paramCount++;
        }

        query += ` ORDER BY t.id_transaccion DESC LIMIT 100`;

        const result = await pool.query(query, params);

        res.status(200).json({
            status: 'Éxito',
            transacciones: result.rows,
            total: result.rows.length
        });

    } catch (error) {
        console.error('❌ Error en obtenerTransacciones:', error);
        res.status(500).json({ status: 'Error', mensaje: 'Error al obtener transacciones', error: error.message });
    }
};

const realizarTransaccion = async (req, res) => {
    const { id_familia, rut_comercio, monto, metodo_pago } = req.body;

    try {
        await pool.query('BEGIN');

        // 1. Validar la Familia
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

        // 2. Validar el Comercio
        const comRes = await pool.query('SELECT estado FROM comercios WHERE rut_comercio = $1', [rut_comercio]);
        if (comRes.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ status: 'Error', mensaje: 'Comercio no encontrado' });
        }
        if (comRes.rows[0].estado !== 'ACTIVO') {
            await pool.query('ROLLBACK');
            return res.status(403).json({ status: 'Error', mensaje: 'El comercio no está habilitado para recibir pagos' });
        }

        // 3. Descontar y sumar saldos
        await pool.query('UPDATE familias SET saldo = saldo - $1 WHERE id_familia = $2', [monto, id_familia]);
        await pool.query('UPDATE comercios SET saldo_acumulado = saldo_acumulado + $1 WHERE rut_comercio = $2', [monto, rut_comercio]);

        // 4. Historial
        await pool.query(
            'INSERT INTO transacciones (id_familia, rut_comercio, monto, metodo_pago) VALUES ($1, $2, $3, $4)',
            [id_familia, rut_comercio, monto, metodo_pago || 'QR'] 
        );

        await pool.query('COMMIT');

        res.status(200).json({ 
            status: 'Éxito', 
            mensaje: 'Transacción aprobada correctamente',
            monto_pagado: monto,
            saldo_restante: familia.saldo - monto 
        });

    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({ status: 'Error', mensaje: 'Error interno en la transacción', error: error.message });
    }
};

const comprarConQR = async (req, res) => {
    const { rut_comercio, monto, qr_token } = req.body;
    let id_familia;

    try {
        const decoded = jwt.verify(qr_token, 'secreto_municipal_qr_2026');
        id_familia = decoded.id_familia; 
    } catch (error) {
        return res.status(401).json({ status: 'Error', mensaje: 'El código QR es inválido o ha expirado. Genere uno nuevo.' });
    }

    try {
        await pool.query('BEGIN');

        const famRes = await pool.query('SELECT saldo, estado FROM familias WHERE id_familia = $1', [id_familia]);
        if (famRes.rows.length === 0 || famRes.rows[0].estado !== 'ACTIVO' || famRes.rows[0].saldo < monto) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ status: 'Error', mensaje: 'Problemas con la cuenta de la familia o saldo insuficiente' });
        }

        const comRes = await pool.query('SELECT estado FROM comercios WHERE rut_comercio = $1', [rut_comercio]);
        if (comRes.rows.length === 0 || comRes.rows[0].estado !== 'ACTIVO') {
            await pool.query('ROLLBACK');
            return res.status(400).json({ status: 'Error', mensaje: 'Comercio no habilitado' });
        }

        await pool.query('UPDATE familias SET saldo = saldo - $1 WHERE id_familia = $2', [monto, id_familia]);
        await pool.query('UPDATE comercios SET saldo_acumulado = saldo_acumulado + $1 WHERE rut_comercio = $2', [monto, rut_comercio]);
        await pool.query(
            'INSERT INTO transacciones (id_familia, rut_comercio, monto, metodo_pago) VALUES ($1, $2, $3, $4)',
            [id_familia, rut_comercio, monto, 'App Movil QR']
        );

        await pool.query('COMMIT');
        
        res.status(200).json({ 
            status: 'Éxito', 
            mensaje: 'Pago con QR aprobado', 
            monto_cobrado: monto,
            saldo_restante: parseInt(famRes.rows[0].saldo) - parseInt(monto)
        });

    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({ status: 'Error', mensaje: 'Error en transacción', error: error.message });
    }
};

module.exports = { realizarTransaccion, comprarConQR, obtenerTransacciones, obtenerMetricas };