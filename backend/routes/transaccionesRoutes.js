const express = require('express');
const router = express.Router();
const { realizarTransaccion } = require('../controllers/transaccionesController');

// Ruta POST para realizar una compra en un comercio
// URL: http://localhost:3000/api/transacciones/comprar
router.post('/comprar', realizarTransaccion);

module.exports = router;