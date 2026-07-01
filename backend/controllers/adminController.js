const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Función para el Login del sistema municipal
const loginAdmin = async (req, res) => {
    const { rut, clave } = req.body;

    try {
        // 1. Buscar al funcionario por su RUT
        const result = await pool.query('SELECT * FROM admin WHERE rut = $1', [rut]);

        // Si no hay resultados, el usuario no existe
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'Error', mensaje: 'Administrador no encontrado' });
        }

        const admin = result.rows[0];

        // 2. Verificar la contraseña usando bcrypt
        const passwordMatch = await bcrypt.compare(clave, admin.clave);
        if (!passwordMatch) {
            return res.status(401).json({ status: 'Error', mensaje: 'Contraseña incorrecta' });
        }

        // 3. Verificar si la cuenta está activa
        if (admin.estado !== 'ACTIVO') {
            return res.status(403).json({ status: 'Error', mensaje: 'Usuario inactivo. Contacte a soporte.' });
        }

        // 4. Si todo está correcto, devolvemos los datos (¡PERO NUNCA LA CONTRASEÑA!)
        res.status(200).json({
            status: 'Éxito',
            mensaje: 'Login correcto',
            usuario: {
                id_admin: admin.id_admin,
                rut: admin.rut,
                nombre_completo: admin.nombre_completo,
                rol: admin.rol
            }
        });

    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: 'Error interno del servidor', error: error.message });
    }
};

// Función para registrar un nuevo Funcionario
// Función para registrar un nuevo Funcionario (Asistente, Jefatura o Encargado de Comercios)
const registrarAdmin = async (req, res) => {
    // Agregamos id_creador para saber quién está intentando registrar a este nuevo usuario
    const { rut, nombre_completo, rol, clave, id_creador } = req.body;

    // 1. Validar que el rol sea uno de los permitidos en el sistema
    const rolesValidos = ['SUPER_ADMIN', 'JEFATURA', 'ASISTENTE_SOCIAL', 'ENCARGADO_COMERCIOS'];
    if (!rolesValidos.includes(rol)) {
        return res.status(400).json({ status: 'Error', mensaje: 'El rol especificado no es válido.' });
    }

    try {
        // 2. (Opcional pero recomendado) Validar quién está creando al usuario
        // Si tienes el id_creador, podrías verificar en la BD si esa persona es JEFATURA o SUPER_ADMIN.
        // Por ahora, como mínimo, protegeremos la creación de Super Admins.
        if (rol === 'SUPER_ADMIN') {
            const creadorRes = await pool.query('SELECT rol FROM admin WHERE id_admin = $1', [id_creador]);
            if (creadorRes.rows.length === 0 || creadorRes.rows[0].rol !== 'SUPER_ADMIN') {
                return res.status(403).json({ status: 'Error', mensaje: 'Solo un Super Admin puede crear a otro Super Admin.' });
            }
        }

        // 3. Verificamos si el RUT ya existe para evitar duplicados
        const checkRes = await pool.query('SELECT rut FROM admin WHERE rut = $1', [rut]);
        if (checkRes.rows.length > 0) {
            return res.status(400).json({ status: 'Error', mensaje: 'El RUT ya está registrado en el sistema' });
        }

        // 4. Encriptamos la clave (NUNCA guardar claves en texto plano)
        const saltRounds = 10;
        const claveHasheada = await bcrypt.hash(clave, saltRounds);

        // 5. Insertamos al nuevo funcionario
        const result = await pool.query(
            `INSERT INTO admin (rut, nombre_completo, rol, clave, estado) 
             VALUES ($1, $2, $3, $4, 'ACTIVO') RETURNING id_admin, rut, nombre_completo, rol, estado`,
            [rut, nombre_completo, rol, claveHasheada]
        );

        res.status(201).json({ 
            status: 'Éxito', 
            mensaje: `${rol.replace('_', ' ')} registrado correctamente`,
            usuario: result.rows[0]
        });

    } catch (error) {
        console.error("🔥 ERROR AL REGISTRAR FUNCIONARIO:", error);
        res.status(500).json({ status: 'Error', mensaje: 'Error interno al registrar', error: error.message });
    }
};

// --- NUEVAS FUNCIONES DE SUPER USUARIO ---

// Obtener todos los funcionarios (para listarlos en el panel)
const obtenerAdministradores = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id_admin, rut, nombre_completo, rol, estado 
            FROM admin 
            ORDER BY id_admin ASC
        `);
        res.status(200).json({ administradores: result.rows });
    } catch (error) {
        console.error("Error al obtener administradores:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// Modificar el rol de un funcionario
const cambiarRol = async (req, res) => {
    const { id_admin } = req.params;
    const { nuevo_rol, id_super_admin } = req.body; 

    const rolesValidos = ['SUPER_ADMIN', 'JEFATURA', 'ASISTENTE_SOCIAL', 'ENCARGADO_COMERCIOS'];
    if (!rolesValidos.includes(nuevo_rol)) {
        return res.status(400).json({ mensaje: "El rol proporcionado no es válido." });
    }

    try {
        // Validar que quien ejecuta la acción sea SUPER_ADMIN
        const verificacion = await pool.query('SELECT rol FROM admin WHERE id_admin = $1', [id_super_admin]);
        
        if (verificacion.rows.length === 0 || verificacion.rows[0].rol !== 'SUPER_ADMIN') {
            return res.status(403).json({ mensaje: "Acceso denegado. Solo un SUPER_ADMIN puede cambiar roles." });
        }

        // Ejecutar el cambio de rol
        const result = await pool.query(
            'UPDATE admin SET rol = $1 WHERE id_admin = $2 RETURNING id_admin, nombre_completo, rol',
            [nuevo_rol, id_admin]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Funcionario no encontrado." });
        }

        res.status(200).json({ 
            mensaje: "Rol actualizado exitosamente", 
            funcionario: result.rows[0] 
        });

    } catch (error) {
        console.error("Error al cambiar rol:", error);
        res.status(500).json({ mensaje: "Error al actualizar el rol en la base de datos" });
    }
};

// Exportar TODAS las funciones
module.exports = { 
    loginAdmin, 
    registrarAdmin,
    obtenerAdministradores,
    cambiarRol
};