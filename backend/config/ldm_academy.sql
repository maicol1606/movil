START TRANSACTION;

DROP DATABASE IF EXISTS `ldm_academy`;

CREATE DATABASE `ldm_academy`;
USE `ldm_academy`;

DROP TABLE IF EXISTS `roles`, `usuarios`, `campañas`, `postulacion`, `asistencia`, `certificacion`, `notificaciones`;

-- Tabla roles
CREATE TABLE `roles` (
    `id_rol` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(50) NOT NULL
);

INSERT INTO roles (id_rol, nombre) VALUES
(1, 'Administrador'),
(2, 'Usuario'),
(3, 'Docente');

-- Tabla usuarios
CREATE TABLE `usuarios` (
    `id_usuario` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(50),
    `apellido` VARCHAR(50),
    `correo` VARCHAR(100) UNIQUE,
    `contrasena` TEXT,
    `telefono` VARCHAR(15),
    `id_rol` INT,
    `curso` VARCHAR(10),
    `estado` BOOLEAN,
    `codigo_verificacion` VARCHAR(10),
    `foto` TEXT
);

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `correo`, `contrasena`, `telefono`, `id_rol`, `curso`, `estado`, `codigo_verificacion`, `foto`) VALUES
-- Admins
(1, 'Luna Stefhanny', 'Diaz Ramirez', 'stefhanny@gmail.com', '$2a$10$2.wvdBJIN1qp/vfEj3SbdeOL0lbqm2M4OOr6ZNfMhkf34VCiXdrGG', '3001111111', 1, NULL, 1, '', ''),
(2, 'Maico', 'Dos', 'maicol@gmail.com', '$2a$10$sf53rKK47.i2kgdTNzCIh.kNdpMQG4CYe5AWdDWpzrrZXMTVHs8v2', '3002222222', 1, NULL, 1, '', ''),
(3, 'Loren Camila', 'Triana Suspes', 'lorencamilatrianasuspes@gmail.com', '$2a$10$rZGvYp65rkb4NPf/eJ42dufEv./tVZCdIbt8m7XiaZaxpdldlJuty', '3003333333', 1, NULL, 1, '', ''),
-- Estudiantes
(4, 'Valeria', 'González Ríos', 'valeria.gonzalez@ldm.edu', '$2a$10$g28wMEG4/4uV372x5Avh2e3brWqq86/iSIhZ0eCDpVEBJVhMWlehe', '3011000001', 2, '1101', 1, '', ''),
(5, 'Dilan', 'Martínez Suárez', 'dilan.martinez@ldm.edu', '$2a$10$Bq3uRXXnSm7754ahjRI0S.x9l9gzSqIY4zhRTxVECn6DlEL5bZmku', '3011000002', 2, '1101', 1, '', ''),
(6, 'Laura', 'Peña Castaño', 'laura.pena@ldm.edu', '$2a$10$y/HSAQAYk0NNUCi0Q0M41eNk8ZuJoCExpx8IffHdmiMSy9qXMd.yW', '3011000003', 2, '1102', 1, 'CD34', ''),
-- Docentes
(7, 'Carlos', 'Moreno Gil', 'carlos.moreno@ldm.edu', '$2a$10$przqYBO8EiJOD8LqEDOnN.zn58HpBj0bPeOT89YIJPiOi4goIBe3O', '3021000001', 3, NULL, 1, '', ''),
(8, 'Marcela', 'Vargas Pérez', 'marcela.vargas@ldm.edu', '$2a$10$9QvLDLAzX06q7HKcBOBkMe00ZB14DWpA/WRFs5sx7XJl5adzL58g2', '3021000002', 3, NULL, 1, '', ''),
(9, 'Sebastián', 'Ortiz Medina', 'sebastian.ortiz@ldm.edu', '$2a$10$uCxuAVp6KXv3dbOwXQOm4.Q5XSD4DJXARJtDUU.T3Ecc.Hp9UDrJ.', '3021000003', 3, NULL, 1, '', '');

-- Tabla campañas
CREATE TABLE `campañas` (
    `id_campaña` INT AUTO_INCREMENT PRIMARY KEY,
    `nom_campaña` VARCHAR(100),
    `descripcion` TEXT,
    `fecha` DATE,
    `cupos` INT,
    `id_docente` INT,
    `imagen` TEXT,
    `estado` BOOLEAN
);

-- Campañas
INSERT INTO `campañas` (`id_campaña`, `nom_campaña`, `descripcion`, `fecha`, `cupos`, `id_docente`, `imagen`, `estado`) VALUES
(1, 'Enfermería', 'Apoyo al orientador a cargo', '2025-04-10', 0, 9, 'campana_1743595226657.jpg', 1),
(2, 'Orientación', 'Apoyo', '2025-04-22', 2, 7, 'campana_1745041272531.jpg', 1),
(3, 'Coordinación', 'Apoyo', '2025-04-25', 2, 8, 'campana_1745041395722.png', 1),
(4, 'Comedor', 'Apoyo', '2025-04-16', 4, 9, 'campana_1745041437984.jpg', 1),
(5, 'Salón', 'Apoyo', '2025-04-23', 4, 9, 'campana_1745041478016.jpg', 1),
(6, 'Biblioteca', 'Apoyo', '2025-04-18', 6, 8, 'campana_1745041514808.jpg', 1),
(7, 'Comedor', 'Apoyo', '2025-05-09', 19, 7, 'campana_1745635062145.png', 1);

-- Tabla postulaciones
CREATE TABLE `postulacion` (
    `id_postulacion` INT AUTO_INCREMENT PRIMARY KEY,
    `id_usuario` INT,
    `id_campaña` INT,
    `estado` VARCHAR(20),
    `fecha` TIMESTAMP
);

INSERT INTO `postulacion` (`id_postulacion`, `id_usuario`, `id_campaña`, `estado`, `fecha`) VALUES
(1, 5, 1, 'aceptada', '2025-06-08 08:15:00'),
(2, 6, 2, 'aceptada', '2025-06-09 09:00:00'),
(3, 4, 2, 'rechazada', '2025-06-05 09:15:00'),
(4, 4, 3, 'pendiente', '2025-06-10 10:00:00');

-- Tabla asistencias
CREATE TABLE `asistencia` (
    `id_asistencia` INT AUTO_INCREMENT PRIMARY KEY,
    `id_campaña` INT,
    `id_usuario` INT,
    `fecha` DATE,
    `hora_inicio` TIME,
    `hora_fin` TIME,
    `horas` INT,
    `novedades` TEXT
);

INSERT INTO `asistencia` (`id_campaña`, `id_usuario`, `fecha`, `hora_inicio`, `hora_fin`, `horas`, `novedades`) VALUES
-- Dilan en Enfermería
(1, 5, '2025-06-16', '07:00:00', '19:00:00', 12, NULL),
(1, 5, '2025-06-17', '07:00:00', '19:00:00', 12, NULL),
(1, 5, '2025-06-18', '07:00:00', '19:00:00', 12, NULL),
(1, 5, '2025-06-19', '07:00:00', '19:00:00', 12, NULL),
(1, 5, '2025-06-20', '07:00:00', '19:00:00', 12, NULL),
(1, 5, '2025-06-21', '07:00:00', '19:00:00', 12, NULL),
(1, 5, '2025-06-22', '07:00:00', '19:00:00', 12, NULL),
(1, 5, '2025-06-23', '07:00:00', '19:00:00', 12, NULL),
(1, 5, '2025-06-24', '07:00:00', '19:00:00', 12, NULL),
(1, 5, '2025-06-25', '07:00:00', '19:00:00', 12, NULL),

-- Laura en Orientación
(2, 6, '2025-06-16', '07:00:00', '19:00:00', 12, NULL),
(2, 6, '2025-06-17', '07:00:00', '19:00:00', 12, 'Llegó tarde'),
(2, 6, '2025-06-18', '07:00:00', '19:00:00', 12, NULL),
(2, 6, '2025-06-19', '07:00:00', '19:00:00', 12, NULL),
(2, 6, '2025-06-20', '07:00:00', '19:00:00', 12, NULL),
(2, 6, '2025-06-21', '07:00:00', '19:00:00', 12, NULL),
(2, 6, '2025-06-22', '07:00:00', '19:00:00', 12, 'No participó'),
(2, 6, '2025-06-23', '07:00:00', '19:00:00', 12, NULL),
(2, 6, '2025-06-24', '07:00:00', '19:00:00', 12, NULL),
(2, 6, '2025-06-25', '07:00:00', '19:00:00', 12, 'No participó');

-- Tabla certificaciones
CREATE TABLE `certificacion` (
    `id_certificacion` INT AUTO_INCREMENT PRIMARY KEY,
    `id_usuario` INT NOT NULL,
    `id_postulacion` INT,
    `certificacion_documento` DECIMAL(12, 0),
    `certificacion_fecha` DATE
);

-- Tabla notificaciones
CREATE TABLE `notificaciones` (
    `id` SERIAL PRIMARY KEY,
    `para_usuario` INT,
    `mensaje` TEXT,
    `leido` BOOLEAN,
    `fecha` TIMESTAMP
);

INSERT INTO `notificaciones` (`id`, `para_usuario`, `mensaje`, `leido`, `fecha`) VALUES
(1, 4, 'Tu asistencia fue registrada en Biblioteca', 0, '2025-06-10 10:05:00'),
(2, 5, 'Tu asistencia fue registrada en Biblioteca', 0, '2025-06-10 10:10:00'),
(3, 6, 'Tu asistencia fue registrada en Comedor', 1, '2025-06-12 15:10:00'),
(4, 4, 'Tu postulación a Comedor fue rechazada', 1, '2025-06-09 12:00:00'),
(5, 5, 'Estás pendiente en la campaña Orientación', 0, '2025-06-10 11:00:00');

-- LLAVES FORANEAS
ALTER TABLE `asistencia`
ADD CONSTRAINT `campaña-asistencia` 
FOREIGN KEY (`id_campaña`) 
REFERENCES `campañas` (`id_campaña`),
ADD CONSTRAINT `usuario-asistencia` 
FOREIGN KEY (`id_usuario`) 
REFERENCES `usuarios` (`id_usuario`);

ALTER TABLE `postulacion`
ADD CONSTRAINT `campaña` 
FOREIGN KEY (`id_campaña`) 
REFERENCES `campañas` (`id_campaña`),
ADD CONSTRAINT `usuario-postulacion` 
FOREIGN KEY (`id_usuario`) 
REFERENCES `usuarios` (`id_usuario`);

ALTER TABLE `usuarios`
ADD CONSTRAINT `rol-usuarios` 
FOREIGN KEY (`id_rol`) 
REFERENCES `roles` (`id_rol`);

ALTER TABLE `campañas`
ADD CONSTRAINT `docente-campaña`
FOREIGN KEY (`id_docente`)
REFERENCES `usuarios` (`id_usuario`);

ALTER TABLE `certificacion`
ADD CONSTRAINT `usuario-certificacion`
FOREIGN KEY (`id_usuario`)
REFERENCES `usuarios` (`id_usuario`),
ADD CONSTRAINT `postulacion-certificacion`
FOREIGN KEY (`id_postulacion`)
REFERENCES `postulacion` (`id_postulacion`);

COMMIT;

