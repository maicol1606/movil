const express = require('express');
const router = express.Router();
const AuthControlador = require('../controladores/authControlador.js');

router.get('/session', AuthControlador.validarSesion);
router.post('/login', AuthControlador.iniciarSesion);
router.post('/enviarCodigo', AuthControlador.enviarCodigo);
router.put('/recuperar', AuthControlador.recuperar);

module.exports = router;