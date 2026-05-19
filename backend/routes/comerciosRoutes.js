const express = require('express');
const router = express.Router();
const { obtenerComercios, obtenerComercioDetalle, crearComercio, cambiarEstadoComercio } = require('../controllers/comerciosController');

// Ruta GET: Listar todos los comercios
router.get('/', obtenerComercios);

// Ruta GET: Ver detalle y ventas de un comercio por RUT
router.get('/:rut', obtenerComercioDetalle);

// Ruta POST: Registrar un comercio nuevo
router.post('/', crearComercio);

// Ruta PUT: Cambiar el estado de un comercio (ej: Dar de baja)
router.put('/:rut/estado', cambiarEstadoComercio);

module.exports = router;