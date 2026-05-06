const express = require('express');
const router = express.Router();
const { crearFamilia, obtenerFamilias } = require('../controllers/familiaController');

// Ruta POST para registrar una nueva familia
router.post('/', crearFamilia);

// Ruta GET para listar todas las familias
router.get('/', obtenerFamilias);

module.exports = router;