const express = require('express');
const router = express.Router();
const asistenciaControlador = require('../controladores/asistenciaControlador');

router.get('/obtenerAsistencias/:id_usuario', asistenciaControlador.obtenerAsistenciasPorEstudiante);

router.get('/mostrarAsistencias/:id', asistenciaControlador.mostrarAsistenciasPorEstudiante);

router.post('/agregarAsistencia', asistenciaControlador.agregarAsistencia);

router.delete('/eliminarAsistencia/:id', asistenciaControlador.eliminarAsistencia);

router.put('/actualizarAsistencia/:id', asistenciaControlador.actualizarAsistencia);

module.exports = router;