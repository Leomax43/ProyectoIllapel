const express = require('express');
const router = express.Router();
const { cambiarEstadoFamilia } = require('../controllers/aprobacionesController');

// Ruta PUT para cambiar el estado de una familia (ej: /api/aprobaciones/familia/2)
router.put('/familia/:id_familia', cambiarEstadoFamilia);

module.exports = router;