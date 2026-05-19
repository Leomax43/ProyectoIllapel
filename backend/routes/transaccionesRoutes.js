const express = require('express');
const router = express.Router();
const { realizarTransaccion, comprarConQR } = require('../controllers/transaccionesController');






// Ruta POST para realizar una compra en un comercio
// URL: http://localhost:3000/api/transacciones/comprar
router.post('/comprar', realizarTransaccion);






// Ruta POST para procesar el pago mediante el QR escaneado
// URL: http://localhost:3000/api/transacciones/comprar-qr
router.post('/comprar-qr', comprarConQR);



module.exports = router;