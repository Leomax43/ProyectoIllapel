const express = require('express');
const router = express.Router();
const { cargarFondos } = require('../controllers/fondosController');

// Ruta POST para inyectar dinero a una familia
// URL: http://localhost:3000/api/fondos/cargar
router.post('/cargar', cargarFondos);

module.exports = router;