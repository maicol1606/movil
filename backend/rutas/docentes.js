const express = require('express');
const router = express.Router();
const docentesControlador = require('../controladores/docentesControlador');

router.get('/obtenerDocentes', docentesControlador.obtenerDocentes);
router.put('/actualizarDocente/:id', docentesControlador.actualizarDocente);
router.delete('/eliminarDocente/:id', docentesControlador.eliminarDocente);
router.put('/restaurarDocente/:id', docentesControlador.restaurarDocente);
router.get('/conteoDocentes', docentesControlador.conteoDocentes);
router.post('/agregarHoras/:id', docentesControlador.agregarHoras);
router.post('/agregarDocente', docentesControlador.agregarDocente);
router.get('/obtenerPerfilDocente', docentesControlador.obtenerPerfilDocente); 

module.exports = router;
