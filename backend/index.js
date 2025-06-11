const express = require('express');
const db = require('./config/db');
const app = express();
const port = 3000;
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Rutas
const estudiantesRutas = require('./rutas/estudiantes');
const docentesRutas = require('./rutas/docentes');
const campanasRutas = require('./rutas/campañas');
const certificadosRutas = require('./rutas/certificados');
const authRutas = require('./rutas/auth');
const postulacionRutas = require('./rutas/postulacion');
const asistenciaRutas = require('./rutas/asistencia');
const estadísticasRutas = require('./rutas/estadisticas');
const rutasNotificaciones = require('./rutas/notificaciones');
const usuarioRutas = require('./rutas/usuario');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api', usuarioRutas);
app.use('/api/auth', authRutas);

app.use('/api/estudiantes', estudiantesRutas);

app.use('/api/docentes', docentesRutas);

app.use('/api/campanas', campanasRutas);

app.use('/api/certificados', certificadosRutas);


app.use('/api/postulacion', postulacionRutas);

app.use('/api/asistencia', asistenciaRutas);

app.use('/api', estadísticasRutas);

app.use('/api', rutasNotificaciones);

// Middleware de error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error en el servidor');
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});