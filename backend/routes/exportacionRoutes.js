const express = require('express');
const router = express.Router();
const { obtenerDatosTabla, obtenerVistaPrevia, obtenerTablas } = require('../controllers/exportacionController');

// Las rutas fijas deben ir ANTES que las rutas con parámetros
router.get('/tablas', obtenerTablas);
router.get('/:tabla/vista-previa', obtenerVistaPrevia);
router.get('/:tabla', obtenerDatosTabla);

module.exports = router;