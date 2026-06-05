const express = require('express');
const router = express.Router();
const { realizarTransaccion, comprarConQR, obtenerTransacciones, obtenerMetricas } = require('../controllers/transaccionesController');




// Ruta GET para obtener métricas del mes actual
// URL: http://localhost:3000/api/transacciones/metricas
router.get('/metricas', obtenerMetricas);

// Ruta GET para obtener todas las transacciones con filtros
// URL: http://localhost:3000/api/transacciones?fecha_inicio=2026-01-01&fecha_fin=2026-12-31&tipo=todos
router.get('/', obtenerTransacciones);




// Ruta POST para realizar una compra en un comercio
// URL: http://localhost:3000/api/transacciones/comprar
router.post('/comprar', realizarTransaccion);

// Ruta POST para realizar una compra en un comercio
// URL: http://localhost:3000/api/transacciones/comprar
router.post('/comprar', realizarTransaccion);






// Ruta POST para procesar el pago mediante el QR escaneado
// URL: http://localhost:3000/api/transacciones/comprar-qr
router.post('/comprar-qr', comprarConQR);



module.exports = router;