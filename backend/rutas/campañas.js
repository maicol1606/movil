const express = require('express');
const router = express.Router();
const campañasControlador = require('../controladores/campañasControlador');

router.get('/mostrarCampanas', campañasControlador.mostrarCampanas);

router.get('/mostrarCampana/:nom_campana', campañasControlador.mostrarCampanaNombre);

router.get('/mostrarCampanaPorId/:id', campañasControlador.mostrarCampanaId);

router.post('/agregarCampana', campañasControlador.uploadCampana, campañasControlador.agregarCampana);

router.put('/actualizarCampana/:id', campañasControlador.actualizarCampana);

router.delete('/eliminarCampana/:id', campañasControlador.eliminarCampana);

router.delete('/eliminarPorCupos/:id', campañasControlador.eliminarPorCupos);

module.exports = router;