const express = require('express');
const router = express.Router();
const { loginAdmin, registrarAdmin, obtenerAdministradores, cambiarRol } = require('../controllers/adminController');

// Rutas de autenticación y registro
router.post('/login', loginAdmin);
router.post('/registrar', registrarAdmin);

// Rutas de gestión (Super Usuario)
router.get('/', obtenerAdministradores);
router.put('/:id_admin/rol', cambiarRol);

module.exports = router;