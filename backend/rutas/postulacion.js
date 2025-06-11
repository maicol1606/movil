const express = require('express');
const router = express.Router();
const postulacionControlador = require('../controladores/postulacionControlador');

router.get('/mostrarPostulaciones', postulacionControlador.mostrarPostulaciones);

router.get('/mostrarPostulacion/:id', postulacionControlador.mostrarPostulacionesUsuario);

router.get('/mostrarPostulacionesPorDocente/:id', postulacionControlador.mostrarPostulacionesPorDocente);

router.post('/agregarPostulacion', postulacionControlador.agregarPostulacion);

router.delete('/eliminarPostulacion/:id', postulacionControlador.eliminarPostulacion);

router.put('/aceptarPostulacion/:id_postulacion', postulacionControlador.aceptarPostulacion);

router.put('/rechazarPostulacion/:id_postulacion', postulacionControlador.rechazarPostulacion);

router.put('/actualizarPostulacion/:id', postulacionControlador.actualizarPostulacion);

module.exports = router;