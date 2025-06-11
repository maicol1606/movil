const db = require("../config/db");

// Crear notificación
const crearNotificacion = (req, res) => {
    const { idEstudiante, nombreEstudiante, campaña, fechaPostulacion } = req.body;

    if (!idEstudiante || !nombreEstudiante || !campaña || !fechaPostulacion) {
        return res.status(400).json({
            error: "Faltan parámetros: idEstudiante, nombreEstudiante, campaña o fechaPostulacion",
        });
    }

    const fecha = new Date();
    const sql =
        "INSERT INTO notificaciones (idEstudiante, nombre_estudiante, campaña, fecha_postulacion, estado, created_at) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(
        sql,
        [idEstudiante, nombreEstudiante, campaña, fechaPostulacion, "En espera", fecha],
        (err, result) => {
            if (err) {
                console.error(" Error al insertar la notificación:", err);
                return res
                    .status(500)
                    .json({ error: "Error al crear la notificación", detalles: err });
            }
            res.status(200).json({ mensaje: "Notificación creada con éxito" });
        }
    );
};

// Obtener notificaciones
const obtenerNotificaciones = (req, res) => {
    const { rol, idUsuario } = req.query;

    let sql = "";
    let params = [];

    if (!rol) {
        // Si no se proporciona ningún rol, retornar todas las notificaciones
        sql = "SELECT * FROM notificaciones ORDER BY created_at DESC";
    } else if (rol === "estudiante" && idUsuario) {
        sql = "SELECT * FROM notificaciones WHERE idEstudiante = ? ORDER BY created_at DESC";
        params = [idUsuario];
    } else if (rol === "docente" || rol === "admin") {
        sql = "SELECT * FROM notificaciones ORDER BY created_at DESC";
    } else {
        return res.status(400).json({ error: "Rol no válido o falta el id del estudiante" });
    }

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error(" Error al obtener notificaciones:", err);
            return res.status(500).json({ error: "Error al obtener notificaciones" });
        }
        res.status(200).json(result);
    });
};

// Actualizar notificación
const actualizarNotificacion = (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ["En espera", "Leído", "Completado", "Aceptado", "Rechazado"];
    if (!estado || typeof estado !== "string" || !estadosValidos.includes(estado.trim())) {
        return res.status(400).json({ error: "Estado no válido o vacío" });
    }

    const sql = "UPDATE notificaciones SET estado = ? WHERE id = ?";
    db.query(sql, [estado.trim(), id], (err, result) => {
        if (err) {
            console.error(" Error al actualizar la notificación:", err);
            return res.status(500).json({ error: "Error al actualizar la notificación" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Notificación no encontrada" });
        }

        res.status(200).json({ mensaje: "Estado actualizado correctamente" });
    });
};

module.exports = {
    crearNotificacion,
    obtenerNotificaciones,
    actualizarNotificacion,
};
