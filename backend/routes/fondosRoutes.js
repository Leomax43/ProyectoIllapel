const express = require('express');
const router = express.Router();
const { cargarFondos } = require('../controllers/fondosController');
const upload = require('../middlewares/uploadMiddleware');

router.post('/cargar/:id_familia', upload.single('archivo'), cargarFondos);

module.exports = router;