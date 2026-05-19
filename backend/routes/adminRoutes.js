const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/adminController');

// Ruta POST para iniciar sesión -> http://localhost:3000/api/admin/login
router.post('/login', loginAdmin);

module.exports = router;