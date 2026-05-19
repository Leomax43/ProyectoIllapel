const express = require('express');
const router = express.Router();
const { obtenerResumen } = require('../controllers/dashboardController');

// Ruta GET para obtener los datos de la vista principal -> http://localhost:3000/api/dashboard/resumen
router.get('/resumen', obtenerResumen);

module.exports = router;