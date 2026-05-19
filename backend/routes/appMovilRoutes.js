const express = require('express');
const router = express.Router();
const { loginFamilia, obtenerCartola, generarQR } = require('../controllers/appMovilController'); 






// Ruta POST: Iniciar sesión en la App
// URL: http://localhost:3000/api/movil/login
router.post('/login', loginFamilia);

// Ruta GET: Ver el historial de compras de la billetera
// URL: http://localhost:3000/api/movil/familia/2/cartola
router.get('/familia/:id_familia/cartola', obtenerCartola);



router.get('/familia/:id_familia/generar-qr', generarQR);



module.exports = router;