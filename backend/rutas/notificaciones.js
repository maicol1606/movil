const express = require('express');
const router = express.Router();
const {
  crearNotificacion,
  obtenerNotificaciones,
  actualizarNotificacion
} = require('../controladores/notificaciones');

// Obtener las notificaciones según el rol y el idUsuario
router.get('/notificaciones', obtenerNotificaciones);

// Crear una nueva notificación
router.post('/notificaciones', crearNotificacion);

// Actualizar el estado de una notificación por id
router.put('/notificaciones/:id', actualizarNotificacion);

module.exports = router;
