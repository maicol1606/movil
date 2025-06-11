const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const secret = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = class AuthControlador {
    static async validarSesion(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];

            // jwt decode and obtain user id
            const decoded = jwt.verify(token, secret);
            const userId = decoded.id_usuario;

            // get user from database
            const query = "SELECT * FROM usuarios WHERE id_usuario = ?";
            const [rows] = await db.promise().query(query, [userId]);

            return res.status(200).json({
                success: true,
                message: "Sesión validada correctamente",
                data: rows[0],
            });
        } catch (error) {
            console.error("Error al validar la sesión:", error);
            return res.status(500).send({ error: "Error al validar la sesión" });
        }
    }

    static async iniciarSesion(req, res) {
        try {
            const { correo, contrasena } = req.body;
            const query = "SELECT * FROM usuarios WHERE correo = ?";
            const [rows] = await db.promise().query(query, [correo]);

            if (rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Usuario no encontrado",
                });
            }

            const usuario = rows[0];

            if (usuario.id_rol === 2) {
                const query =
                    "SELECT * FROM postulacion WHERE id_usuario = ? and estado = 'aceptada'";

                const [rows] = await db.promise().query(query, [usuario.id_usuario]);
                if (rows.length === 0) {
                    return res.status(401).json({
                        success: false,
                        message: "Usuario no aceptado",
                    });
                }

                const postulacion = rows[0];

                // validar si pasaron 6 meses desde la fecha de aceptacion
                const fechaAceptacion = new Date(postulacion.fecha);
                const fechaActual = new Date();
                const diferencia = fechaActual.getTime() - fechaAceptacion.getTime();
                const meses = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 30));
                if (meses > 6) {
                    const query2 = "UPDATE usuarios SET estado = 0 WHERE id_usuario = ?";
                    await db.promise().query(query2, [usuario.id_usuario]);

                    return res.status(401).json({
                        success: false,
                        message:
                            "Cuenta deshabilitada por no haber realizado el servicio social en el tiempo establecido",
                    });
                }
            }

            const contrasenaValida = bcrypt.compareSync(contrasena, usuario.contrasena);

            if (!contrasenaValida) {
                return res.status(401).json({
                    success: false,
                    message: "Contraseña incorrecta",
                });
            }

            const token = jwt.sign({ id_usuario: usuario.id_usuario }, secret, { expiresIn: "3h" });

            return res.status(200).json({
                success: true,
                message: "Sesión iniciada correctamente",
                data: { token, rol: usuario.rol_id },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error al iniciar sesión: " + error.message,
                error: error.message,
            });
        }
    }

    static async enviarCodigo(req, res) {
        try {
            const correo = req.body.correo;
            const query = "SELECT * FROM usuarios WHERE correo = ? and estado = 1";

            const [rows] = await db.promise().query(query, [correo]);

            if (rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Usuario no encontrado",
                });
            }

            const usuario = rows[0];
            const codigo = Math.floor(Math.random() * 9000) + 1000;

            const emailOptions = {
                from: process.env.EMAIL_USER,
                to: correo,
                subject: "Recuperar contraseña | LDM Academy",
                html: `
                <div class="container" style="background-color:rgb(41, 62, 247); color: white; padding: 80px;">
                    <div class="imagen" style="text-align: center;">
                    </div>
                    <h1>Recuperación de Contraseña</h1>
                    <p style="font-size: 25px;">Tu código de verificación es:</p>
                    <h2 style="font-size: 40px; font-weight: bold; color:rgb(43, 60, 207);">${codigo}</h2>
                    <p>Por favor, ingrésalo en el formulario de recuperación de contraseña.</p>
                    <p>Este código caducará en 1 hora.</p>
                    <p>Si no solicitaste este cambio, ignora este mensaje.</p>
                    <p>Gracias,</p>
                    <p>El equipo de soporte</p>

                </div>
                `,
            };

            transporter.sendMail(emailOptions, function (error, info) {
                if (error) {
                    return res.status(500).json({
                        success: false,
                        message: "Error al enviar el correo",
                        error: error.message,
                    });
                }

                db.query(
                    "UPDATE usuarios SET codigo_verificacion = ? WHERE correo = ?",
                    [codigo, usuario.correo],
                    (error, results) => {
                        if (error) {
                            return res.status(500).json({
                                success: false,
                                message: "Error al actualizar el usuario",
                                error: error.message,
                            });
                        }

                        return res.status(200).json({
                            success: true,
                            message: "Correo enviado correctamente",
                        });
                    }
                );
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error al enviar el correo",
                error: error.message,
            });
        }
    }

    static async recuperar(req, res) {
        try {
            const { correo, codigo, contrasena } = req.body;

            const contrasenaEncriptada = bcrypt.hashSync(contrasena, 10);

            const query = "SELECT * FROM usuarios WHERE correo = ? and codigo_verificacion = ?";
            const [rows] = await db.promise().query(query, [correo, codigo]);

            if (rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Correo o codigo incorrecto",
                });
            }

            const query2 = "UPDATE usuarios SET contrasena = ? WHERE correo = ?";
            const [rows2] = await db.promise().query(query2, [contrasenaEncriptada, correo]);

            if (rows2.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Error al actualizar el usuario",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Contraseña actualizada correctamente",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error al recuperar la contraseña",
                error: error.message,
            });
        }
    }
};
