const express = require('express');
const router = express.Router();
const { cargarFondos } = require('../controllers/fondosController');
const upload = require('../middlewares/uploadMiddleware'); // <-- IMPORTAR EL MIDDLEWARE Y REUTILIZARLO

// Nueva estructura de URL: /api/fondos/cargar/2
// Multer procesará el archivo bajo el parámetro 'archivo' antes de pasar al controlador
router.post('/cargar/:id_familia', upload.single('archivo'), cargarFondos);

module.exports = router;