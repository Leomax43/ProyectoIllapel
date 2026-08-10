const pool = require('../config/db');

// Obtener todas las subrogaciones activas e históricas
const obtenerSubrogaciones = async (req, res) => {
    try {
        // Auto-finalizar subrogaciones cuyo fecha_fin ya pasó
        const expiradas = await pool.query(`
            UPDATE subrogaciones SET estado = 'FINALIZADA'
            WHERE estado = 'ACTIVO' AND fecha_fin < CURRENT_DATE
            RETURNING id_subrogacion, id_admin_subrogado, rol_original
        `);

        // Restaurar el rol original de quienes ya no tienen ninguna subrogación activa
        for (const exp of expiradas.rows) {
            const otras = await pool.query(`
                SELECT 1 FROM subrogaciones
                WHERE id_admin_subrogado = $1 AND estado = 'ACTIVO' AND id_subrogacion <> $2 LIMIT 1
            `, [exp.id_admin_subrogado, exp.id_subrogacion]);
            if (otras.rows.length === 0) {
                await pool.query('UPDATE admin SET rol = $1 WHERE id_admin = $2', [exp.rol_original, exp.id_admin_subrogado]);
            }
        }

        const result = await pool.query(`
            SELECT 
                s.id_subrogacion,
                s.id_admin_subrogado,
                a_sub.nombre_completo AS nombre_subrogado,
                a_sub.rut AS rut_subrogado,
                a_sub.rol AS rol_actual_subrogado,
                s.rol_asignado,
                s.rol_original,
                s.motivo,
                s.fecha_inicio,
                s.fecha_fin,
                s.estado,
                s.id_super_admin,
                a_super.nombre_completo AS nombre_super_admin
            FROM subrogaciones s
            JOIN admin a_sub ON s.id_admin_subrogado = a_sub.id_admin
            JOIN admin a_super ON s.id_super_admin = a_super.id_admin
            ORDER BY s.fecha_inicio DESC
        `);
        res.status(200).json({ subrogaciones: result.rows });
    } catch (error) {
        console.error("Error al obtener subrogaciones:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// Crear una nueva subrogación
const crearSubrogacion = async (req, res) => {
    const { id_admin_subrogado, rol_asignado, fecha_inicio, fecha_fin, motivo, id_super_admin } = req.body;

    try {
        // 1. Validar que el SUPER_ADMIN existe
        const superRes = await pool.query('SELECT rol FROM admin WHERE id_admin = $1', [id_super_admin]);
        if (superRes.rows.length === 0 || superRes.rows[0].rol !== 'SUPER_ADMIN') {
            return res.status(403).json({ mensaje: "Acceso denegado. Solo un SUPER_ADMIN puede crear subrogaciones." });
        }

        // 2. Obtener el rol actual del admin a subrogar
        const adminRes = await pool.query('SELECT rol FROM admin WHERE id_admin = $1', [id_admin_subrogado]);
        if (adminRes.rows.length === 0) {
            return res.status(404).json({ mensaje: "Administrador no encontrado." });
        }
        const rol_original = adminRes.rows[0].rol;

        // 3. Validar que el rol_asignado sea válido
        const rolesValidos = ['SUPER_ADMIN', 'JEFATURA', 'ASISTENTE_SOCIAL', 'ENCARGADO_COMERCIOS'];
        if (!rolesValidos.includes(rol_asignado)) {
            return res.status(400).json({ mensaje: "El rol asignado no es válido." });
        }

        // 3.1 Validar fechas
        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({ mensaje: "Debes indicar las fechas de inicio y fin." });
        }
        const hoy = new Date();
        const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
        const fechaInicioStr = String(fecha_inicio).split('T')[0];
        const fechaFinStr = String(fecha_fin).split('T')[0];

        if (fechaInicioStr < hoyStr) {
            return res.status(400).json({ mensaje: "La fecha de inicio no puede ser anterior a hoy." });
        }
        if (fechaFinStr <= fechaInicioStr) {
            return res.status(400).json({ mensaje: "La fecha de fin debe ser posterior a la fecha de inicio." });
        }

        // 3.2 Evitar solapamiento: el admin no puede tener otra subrogación activa
        const activaRes = await pool.query(
            'SELECT id_subrogacion FROM subrogaciones WHERE id_admin_subrogado = $1 AND estado = $2 LIMIT 1',
            [id_admin_subrogado, 'ACTIVO']
        );
        if (activaRes.rows.length > 0) {
            return res.status(400).json({ mensaje: "El administrador ya tiene una subrogación activa. Finalízala antes de crear otra." });
        }

        // 4. Insertar la subrogación
        const result = await pool.query(`
            INSERT INTO subrogaciones (id_admin_subrogado, rol_asignado, rol_original, fecha_inicio, fecha_fin, motivo, id_super_admin, estado)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'ACTIVO')
            RETURNING *
        `, [id_admin_subrogado, rol_asignado, rol_original, fecha_inicio, fecha_fin, motivo, id_super_admin]);

        // 5. Actualizar el rol del admin en la tabla admin
        await pool.query('UPDATE admin SET rol = $1 WHERE id_admin = $2', [rol_asignado, id_admin_subrogado]);

        res.status(201).json({ 
            mensaje: "Subrogación creada exitosamente", 
            subrogacion: result.rows[0] 
        });

    } catch (error) {
        console.error("Error al crear subrogación:", error);
        res.status(500).json({ mensaje: "Error interno del servidor", error: error.message });
    }
};

// Finalizar una subrogación (restaurar rol original)
const finalizarSubrogacion = async (req, res) => {
    const { id_subrogacion } = req.params;
    const { id_super_admin } = req.body;

    try {
        // 1. Validar SUPER_ADMIN
        const superRes = await pool.query('SELECT rol FROM admin WHERE id_admin = $1', [id_super_admin]);
        if (superRes.rows.length === 0 || superRes.rows[0].rol !== 'SUPER_ADMIN') {
            return res.status(403).json({ mensaje: "Acceso denegado." });
        }

        // 2. Obtener la subrogación
        const subRes = await pool.query('SELECT * FROM subrogaciones WHERE id_subrogacion = $1', [id_subrogacion]);
        if (subRes.rows.length === 0) {
            return res.status(404).json({ mensaje: "Subrogación no encontrada." });
        }

        const subrogacion = subRes.rows[0];

        // 3. Restaurar el rol original
        await pool.query('UPDATE admin SET rol = $1 WHERE id_admin = $2', 
            [subrogacion.rol_original, subrogacion.id_admin_subrogado]);

        // 4. Marcar subrogación como finalizada
        await pool.query('UPDATE subrogaciones SET estado = $1 WHERE id_subrogacion = $2', 
            ['FINALIZADA', id_subrogacion]);

        res.status(200).json({ mensaje: "Subrogación finalizada correctamente" });

    } catch (error) {
        console.error("Error al finalizar subrogación:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

module.exports = { obtenerSubrogaciones, crearSubrogacion, finalizarSubrogacion };