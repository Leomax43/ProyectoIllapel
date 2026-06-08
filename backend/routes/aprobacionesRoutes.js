const express = require('express');
const router = express.Router();
const { 
    cambiarEstadoFamilia, 
    obtenerSolicitudesFondos, 
    aprobarSolicitudFondo, 
    rechazarSolicitudFondo 
} = require('../controllers/aprobacionesController');

// Ruta PUT para cambiar el estado de una familia (ej: /api/aprobaciones/familia/2)
router.put('/familia/:id_familia', cambiarEstadoFamilia);


// --- NUEVAS RUTAS PARA EL FLUJO DE FONDOS (JEFATURA) ---

// 1. Ruta GET para que Jefatura vea la bandeja de solicitudes de dinero pendientes
// URL: http://localhost:3000/api/aprobaciones/fondos/pendientes
router.get('/fondos/pendientes', obtenerSolicitudesFondos);

// 2. Ruta PUT para aprobar una solicitud específica y transferir el dinero real
// URL: http://localhost:3000/api/aprobaciones/fondos/:id_carga/aprobar
router.put('/fondos/:id_carga/aprobar', aprobarSolicitudFondo);

// 3. Ruta PUT para rechazar una solicitud específica sin alterar los saldos
// URL: http://localhost:3000/api/aprobaciones/fondos/:id_carga/rechazar
router.put('/fondos/:id_carga/rechazar', rechazarSolicitudFondo);


module.exports = router;