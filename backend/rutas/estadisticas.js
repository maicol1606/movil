const express = require('express');
const router = express.Router();
const estadisticasControlador = require('../controladores/estadisticasControlador');

router.get('/obtenerEstadisticas', estadisticasControlador.obtenerEstadisticas);

module.exports = router;