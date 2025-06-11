const express = require("express");
const multer = require("multer");
const path = require("path");

const UsuarioControlador = require("../controladores/usuarioControlador");
const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "../frontend/public/img/usuarios/");
        },
    }),
});

router.post("/usuarios", UsuarioControlador.crearUsuario);

router.get("/usuarios", UsuarioControlador.obtenerUsuarios);

router.get("/usuarios/:id", UsuarioControlador.obtenerUsuario);

router.put("/usuarios/:id", upload.single("foto"), UsuarioControlador.actualizarUsuario);

router.delete("/usuarios/:id", UsuarioControlador.eliminarUsuario);

module.exports = router;
