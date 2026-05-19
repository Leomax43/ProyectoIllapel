const pool = require('../config/db');

const cargarFondos = async (req, res) => {
    // Recibimos quién recibe (id_familia), quién autoriza (id_admin) y cuánta plata (monto)
    const { id_familia, id_admin, monto } = req.body;

    try {
        // 1. Iniciamos una "Transacción". Esto asegura que si algo falla a la mitad, 
        // no se guarde nada (evita que se registre la recarga pero no se sume el saldo).
        await pool.query('BEGIN');

        // 2. Verificar que la familia exista y esté ACTIVA
        const famRes = await pool.query('SELECT saldo, estado FROM familias WHERE id_familia = $1', [id_familia]);
        
        if (famRes.rows.length === 0) {
            await pool.query('ROLLBACK'); // Abortar transacción
            return res.status(404).json({ status: 'Error', mensaje: 'Familia no encontrada' });
        }

        const familia = famRes.rows[0];
        
        if (familia.estado !== 'ACTIVO') {
            await pool.query('ROLLBACK');
            return res.status(403).json({ status: 'Error', mensaje: 'La cuenta de la familia no está ACTIVA (Estado actual: ' + familia.estado + ')' });
        }




        /* Voy a desactivar esto para probar si funciona sin la regla y todo bien
        
        // 3. REGLA DE NEGOCIO: Validar la regla de los 30 días
        const ultimasCargas = await pool.query(`
            SELECT fecha FROM cargas_fondos 
            WHERE id_familia = $1 AND fecha >= NOW() - INTERVAL '30 days'
        `, [id_familia]);

        if (ultimasCargas.rows.length > 0) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ 
                status: 'Error', 
                mensaje: 'Bloqueo: El núcleo familiar ya recibió fondos en los últimos 30 días.' 
            });
        }
        */


        // 4. Registrar la carga en el historial
        await pool.query(
            'INSERT INTO cargas_fondos (id_familia, id_admin, monto) VALUES ($1, $2, $3)',
            [id_familia, id_admin, monto]
        );

        // 5. Actualizar (sumar) el saldo de la familia
        await pool.query(
            'UPDATE familias SET saldo = saldo + $1 WHERE id_familia = $2',
            [monto, id_familia]
        );

        // 6. Si llegamos hasta aquí sin errores, guardamos los cambios de forma permanente
        await pool.query('COMMIT');

        res.status(200).json({ 
            status: 'Éxito', 
            mensaje: 'Fondos cargados correctamente', 
            nuevo_saldo: familia.saldo + monto 
        });

    } catch (error) {
        await pool.query('ROLLBACK'); // Si el servidor explota, deshacemos todo
        res.status(500).json({ status: 'Error', mensaje: 'Error interno al cargar fondos', error: error.message });
    }
};

module.exports = { cargarFondos };