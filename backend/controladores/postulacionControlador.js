const db = require("../config/db");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "lulo06817@gmail.com",
        pass: "bhkl iubb afws zrfo",
    },
});
exports.mostrarPostulaciones = (req, res) => {
    db.query("SELECT * FROM postulacion", (error, results) => {
        if (error) {
            console.error("Error al obtener las postulaciones:", error);
            res.status(500).json({ error: "Error al obtener las postulaciones" });
        } else {
            res.status(200).send(results);
        }
    });
};

exports.mostrarPostulacionesUsuario = (req, res) => {
    id = req.params.id;
    const values = [id];
    db.query("SELECT * FROM postulacion WHERE id_usuario = ?", values, (error, results) => {
        if (error) {
            console.error("Error al obtener las postulaciones:", error);
            res.status(500).json({ error: "Error al obtener las postulaciones" });
        } else {
            res.status(200).send(results);
        }
    });
};

exports.mostrarPostulacionesPorDocente = (req, res) => {
    id = req.params.id;
    const values = [id];
    db.query(
        "SELECT campañas.*, postulacion.*, postulacion.estado as estado_postulacion, usuarios.* FROM postulacion INNER JOIN campañas ON postulacion.id_campaña = campañas.id_campaña INNER JOIN usuarios ON postulacion.id_usuario = usuarios.id_usuario WHERE id_docente = ?",
        values,
        (error, results) => {
            if (error) {
                console.error("Error al obtener las postulaciones:", error);
                res.status(500).json({ error: "Error al obtener las postulaciones" });
            } else {
                res.status(200).send(results);
            }
        }
    );
};

exports.mostrarPostulacionId = (req, res) => {
    const id = req.params.id;
    const query = "SELECT * FROM postulaciones WHERE id_postulacion = ?";
    db.query(query, [id], (error, results) => {
        if (error) {
            console.error("Error al obtener la postulación:", error);
            res.status(500).json({ error: "Error al obtener la postulación" });
        } else {
            res.status(200).send(results);
        }
    });
};

exports.agregarPostulacion = (req, res) => {
    const id_usuario = req.body.id_usuario;
    const id_campaña = req.body.id_campaña;
    const campañaq = "SELECT * FROM campañas WHERE id_campaña = ?";

    // 1. CAMPAÑA PARA POSTULARSE
    db.query(campañaq, [id_campaña], (error, campana_results) => {
        if (error) {
            console.error("Error al obtener la campaña:", error);
            res.status(500).json({ error: "Error al obtener la campaña" });
        } else {
            if (campana_results.length === 0) {
                res.status(404).json({ error: "Campaña no encontrada" });
            } else {
                if (campana_results[0].cupos === 0) {
                    res.status(400).json({ error: "La campaña está llena" });
                } else {
                    const id_docente = campana_results[0].id_docente;
                    // Agregar al usuario a la postulación
                    const query = "INSERT INTO postulacion (id_usuario, id_campaña) VALUES (?, ?)";
                    db.query(query, [id_usuario, id_campaña], (error, results) => {
                        if (error) {
                            console.error("Error al agregar la postulación:", error);
                            res.status(500).json({ error: "Error al agregar la postulación" });
                        } else {
                            const quitarCupo =
                                "UPDATE campañas SET cupos = cupos - 1 WHERE id_campaña = ?";
                            db.query(quitarCupo, [id_campaña], (error, results) => {
                                if (error) {
                                    console.error("Error al quitar el cupo de la campaña:", error);
                                    res.status(500).json({
                                        error: "Error al quitar el cupo de la campaña",
                                    });
                                }

                                // ENVIAR CORREO AL DOCENTE
                                const query = "SELECT * FROM usuarios WHERE id_usuario = ?";
                                db.query(query, [id_docente], (error, docente) => {
                                    if (error) {
                                        console.error("Error al obtener el docente:", error);
                                        res.status(500).json({
                                            error: "Error al obtener el docente",
                                        });
                                    }

                                    const usuarioq = "SELECT * FROM usuarios WHERE id_usuario = ?";
                                    db.query(usuarioq, [id_usuario], (error, usuario) => {
                                        if (error) {
                                            console.error("Error al obtener el usuario:", error);
                                            res.status(500).json({
                                                error: "Error al obtener el usuario",
                                            });
                                        }
                                        const user = usuario[0];
                                        const mailOptions = {
                                            from: "lulo06817@gmail.com",
                                            to: docente[0].correo,
                                            subject: "Nueva Postulación",
                                            html: `
                                            <div style="text-align: center; background-color: #f2f2f2; color: #333; padding: 20px; font-family: Arial, sans-serif;">
                                                <h1>Nueva Postulación</h1>
                                                <p>El usuario <strong> ${user.nombre} ${user.apellido}</strong> con el correo <strong>${user.correo}</strong> se ha postulado a la campaña <strong>${campana_results[0].nom_campaña}</strong></p>
                                                <p>Por favor, revisar la postulación en la plataforma.</p>
                                                <p>Gracias por su colaboración.</p>
                                            </div>
                                            `,
                                        };

                                        transporter.sendMail(mailOptions, function (error, info) {
                                            if (error) {
                                                console.error(error);
                                            }
                                            res.status(200).json({
                                                message: "Postulación agregada correctamente",
                                            });
                                        });
                                    });
                                });
                            });
                        }
                    });
                }
            }
        }
    });
};

exports.aceptarPostulacion = (req, res) => {
    const id_postulacion = req.params.id_postulacion;
    const correo = req.body.correo;

    const query = `UPDATE postulacion SET estado = 'aceptada', fecha = NOW() WHERE id_postulacion = ?`;

    db.query(query, [id_postulacion], (error, results) => {
        if (error) {
            console.error("Error al aceptar la postulación:", error);
            res.status(500).json({ error: "Error al aceptar la postulación" });
        } else {
            const mailOptions = {
                from: "lulo06817@gmail.com",
                to: correo,
                subject: "Postulación Aceptada",
                html: `
                    <div style="text-align: center; background-color: #f2f2f2; color: #333; padding: 20px; font-family: Arial, sans-serif;">
                        <h1>Postulación Aceptada</h1>
                        <p>Su postulación ha sido aceptada.</p>
                        <p>Gracias por su colaboración.</p>
                    </div>
                    `,
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error(error);
                }
                res.status(200).json({ message: "Postulación aceptada correctamente" });
            });
        }
    });
};

exports.rechazarPostulacion = (req, res) => {
    const id_postulacion = req.params.id_postulacion;
    const correo = req.body.correo;
    const query = `UPDATE postulacion SET estado = 'rechazada', fecha = NOW() WHERE id_postulacion = ?`;
    db.query(query, [id_postulacion], (error, results) => {
        if (error) {
            console.error("Error al rechazar la postulación:", error);
            res.status(500).json({ error: "Error al rechazar la postulación" });
        } else {
            const mailOptions = {
                from: "lulo06817@gmail.com",
                to: correo,
                subject: "Postulación Rechazada",
                html: `
                    <div style="text-align: center; background-color: #f2f2f2; color: #333; padding: 20px; font-family: Arial, sans-serif;">
                        <h1>Postulación Rechazada</h1>
                        <p>Su postulación ha sido rechazada.</p>
                        <p>Intentalo de nuevo.</p>
                    </div>
                                            `,
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error(error);
                }
                res.status(200).json({ message: "Postulación rechazada correctamente" });
            });
        }
    });
};

exports.actualizarPostulacion = (req, res) => {
    const id_usuario = req.body.id_usuario;
    const id_campaña = req.body.id_campaña;
    const aceptacion = req.body.aceptacion;
    const id_postulacion = req.params.id_postulacion;
    const query =
        "UPDATE postulaciones SET id_usuario = ?, id_campaña = ?, aceptacion = ? WHERE id_postulacion = ?";
    db.query(query, [id_usuario, id_campaña, aceptacion, id_postulacion], (error, results) => {
        if (error) {
            console.error("Error al actualizar la postulación:", error);
            res.status(500).json({ error: "Error al actualizar la postulación" });
        } else {
            res.status(200).json({ message: "Postulación actualizada correctamente" });
        }
    });
};

exports.eliminarPostulacion = (req, res) => {
    const id_postulacion = req.params.id_postulacion;
    const query = "DELETE FROM postulaciones WHERE id_postulacion = ?";
    db.query(query, [id_postulacion], (error, results) => {
        if (error) {
            console.error("Error al eliminar la postulación:", error);
            res.status(500).json({ error: "Error al eliminar la postulación" });
        } else {
            res.status(200).json({ message: "Postulación eliminada correctamente" });
        }
    });
};
