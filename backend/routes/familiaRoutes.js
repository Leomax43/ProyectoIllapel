const express = require('express');
const router = express.Router();
const { crearFamilia, actualizarFamilia, obtenerFamilias, obtenerFamiliaDetalle, subirFichaSocial, obtenerEstadisticasBeneficiarios } = require('../controllers/familiaController');
const upload = require('../middlewares/uploadMiddleware');

// Ruta POST para registrar una nueva familia
router.post('/', crearFamilia);

// Ruta PUT para actualizar una familia existente
router.put('/:rut', actualizarFamilia);

// Ruta GET para obtener estadísticas de beneficiarios (pills)
router.get('/stats/beneficiarios', obtenerEstadisticasBeneficiarios);

// Ruta GET para listar todas las familias
router.get('/', obtenerFamilias);

// Ruta GET para obtener una familia por RUT
router.get('/:rut', obtenerFamiliaDetalle);

// Ruta POST para subir ficha social
router.post('/:id_familia/ficha-social', upload.single('archivo'), subirFichaSocial);

module.exports = router;