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

module.exports = { loginAdmin };