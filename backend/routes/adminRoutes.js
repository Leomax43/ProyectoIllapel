const express = require('express');
const router = express.Router();
const { loginAdmin,registrarAdmin } = require('../controllers/adminController');

// Ruta POST para iniciar sesión -> http://localhost:3000/api/admin/login
router.post('/login', loginAdmin);


//  Ruta POST para registrar a un nuevo funcionario
router.post('/registrar', registrarAdmin);


module.exports = router;