const express = require('express');
const router = express.Router();
const { cargarFondos, obtenerCargas } = require('../controllers/fondosController');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', obtenerCargas);
router.post('/:id_familia/cargar', upload.single('pdf_resolucion'), cargarFondos);


module.exports = router;