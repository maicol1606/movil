const express = require('express');
const router = express.Router();
const estudiantesControlador = require('../controladores/estudiantesControlador');
const multer = require('multer');
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, '../frontend/public/img/usuarios/');
        },
    }),
});

router.get('/obtenerEstudiantes/', estudiantesControlador.obtenerEstudiantes);

router.get('/obtenerEstudiantes/:id', estudiantesControlador.obtenerEstudiante);

router.put('/actualizarEstudiante/:id', upload.single('foto'), estudiantesControlador.actualizarEstudiante);

router.delete('/eliminarEstudiante/:id', estudiantesControlador.eliminarEstudiante);

router.put('/restaurarEstudiante/:id', estudiantesControlador.restaurarEstudiante);

router.get('/conteoEstudiantes', estudiantesControlador.conteoEstudiantes);

router.get('/mostrarHorasEstudiante/:id/:fecha', estudiantesControlador.mostrarHorasEstudiante);

router.get('/llamarEstudiantes', estudiantesControlador.llamarEstudiantes);

router.get('/asistenciaEstudiante/:id', estudiantesControlador.obtenerAsistenciaEstudiante);

router.post('/:id/certificar', estudiantesControlador.certificar);

router.get('/certificaciones', estudiantesControlador.obtenerCertificaciones);

module.exports = router;
