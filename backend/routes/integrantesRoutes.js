const express = require('express');
const router = express.Router();
const { agregarIntegrante, eliminarIntegrante } = require('../controllers/integrantesController');

// Ruta POST: Agregar integrante a una familia (ej: /api/integrantes/familia/2)
router.post('/familia/:id_familia', agregarIntegrante);

// Ruta DELETE: Eliminar un integrante específico por su ID (ej: /api/integrantes/3)
router.delete('/:id_integrante', eliminarIntegrante);

module.exports = router;