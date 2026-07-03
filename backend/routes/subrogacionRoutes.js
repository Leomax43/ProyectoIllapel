const express = require('express');
const router = express.Router();
const { obtenerSubrogaciones, crearSubrogacion, finalizarSubrogacion } = require('../controllers/subrogacionController');

router.get('/', obtenerSubrogaciones);
router.post('/', crearSubrogacion);
router.put('/:id_subrogacion/finalizar', finalizarSubrogacion);

module.exports = router;