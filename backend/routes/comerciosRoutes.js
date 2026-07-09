const express = require('express');
const router = express.Router();
const uploadComercio = require('../middlewares/uploadComercioMiddleware');

const { 
    obtenerComercios, 
    obtenerComercioDetalle, 
    crearComercio, 
    cambiarEstadoComercio, 
    actualizarComercio,
    liquidarComercio,
    obtenerLiquidacionesComercio
} = require('../controllers/comerciosController');

// Ruta GET: Listar todos los comercios
router.get('/', obtenerComercios);

// Ruta GET: Ver detalle y ventas de un comercio por RUT
router.get('/:rut', obtenerComercioDetalle);

// Ruta GET: Obtener historial de pagos/liquidaciones de un comercio
router.get('/:rut/liquidaciones', obtenerLiquidacionesComercio);

// Ruta POST: Registrar un comercio nuevo
router.post('/', crearComercio);

// Ruta POST: Liquidar los fondos de un comercio (usando el middleware)
router.post('/:rut/liquidar', uploadComercio.single('comprobante'), liquidarComercio);

// Ruta PUT: Cambiar el estado de un comercio (ej: Dar de baja)
router.put('/:rut/estado', cambiarEstadoComercio);

// Ruta PUT: Actualizar datos de un comercio por RUT
router.put('/:rut', actualizarComercio);

module.exports = router;