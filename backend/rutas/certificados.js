const express = require('express');
const router = express.Router();
const certificadoControlador = require('../controladores/certificadoControlador');

router.get('/mostrarCertificados', certificadoControlador.mostrarCertificados);

router.post('/agregarCertificado', certificadoControlador.agregarCertificado);

router.delete('/eliminarCertificado/:id', certificadoControlador.eliminarCertificado);

router.put('/actualizarCertificado/:id', certificadoControlador.actualizarCertificado);

module.exports = router;
