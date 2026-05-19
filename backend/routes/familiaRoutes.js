const express = require('express');
const router = express.Router();
const { crearFamilia, obtenerFamilias, obtenerFamiliaDetalle } = require('../controllers/familiaController');

// Ruta POST para registrar una nueva familia
router.post('/', crearFamilia);

// Ruta GET para listar todas las familias
router.get('/', obtenerFamilias);

router.get('/:rut', obtenerFamiliaDetalle);


module.exports = router;