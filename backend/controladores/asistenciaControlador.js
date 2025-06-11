const e = require("express");
const db = require("../config/db");
const moment = require("moment"); // Si decides usar moment.js para manejar fechas.

exports.mostrarAsistenciasPorEstudiante = async (req, res) => {
    try {
        const idUsuario = req.params.id;

        const query =
            "SELECT asistencia.*, campañas.*  FROM asistencia INNER JOIN campañas ON asistencia.id_campaña = campañas.id_campaña WHERE asistencia.id_usuario = ?";

        const [result] = await db.promise().query(query, [idUsuario]);

        res.status(200).json({
            success: true,
            data: result,
            message: "Asistencias obtenidas correctamente",
        })
    } catch (error) {
        console.error("Error al obtener asistencias por estudiante:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener asistencias",
        });
    }
};

exports.obtenerAsistenciasPorEstudiante = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const [rows] = await db.query(
            `
                SELECT a.*, 
                        c.nom_campaña AS campaña_nombre, 
                        c.fecha, 
                        ud.nombre AS docente_nombre, 
                        ue.nombre AS estudiante_nombre 
                FROM asistencia a 
                JOIN campañas c ON a.id_campaña = c.id_campaña 
                JOIN usuarios ud ON c.id_docente = ud.id_usuario 
                JOIN usuarios ue ON a.id_usuario = ue.id_usuario 
                WHERE a.id_usuario = ?
                ORDER BY a.fecha ASC
            `,
            [id_usuario]
        );

        if (rows.length === 0) {
            return res
                .status(404)
                .json({ error: "No se encontraron asistencias para este estudiante." });
        }

        const totalHoras = rows.reduce((acc, curr) => acc + curr.horas, 0);
        const promedioHoras = (totalHoras / rows.length).toFixed(2);
        const inicioServicio = moment(rows[0].fecha).format("YYYY-MM-DD");
        const finServicio = moment(rows[rows.length - 1].fecha).format("YYYY-MM-DD");

        res.json(
            {
                nombre: rows[0].estudiante_nombre,
                horasCumplidas: totalHoras,
                promedioHoras,
                inicioServicio,
                finServicio,
                campaña: {
                    nombre: rows[0].campaña_nombre,
                    fechaCreacion: moment(rows[0].fecha).format("YYYY-MM-DD"),
                    docente: rows[0].docente_nombre,
                },
                asistencias: rows.map((row) => ({
                    fecha: moment(row.fecha).format("YYYY-MM-DD"), // Formateo de fecha
                    horas: row.horas,
                    campaña: row.campaña_nombre,
                })),
            },
            200
        );
    } catch (error) {
        console.error("Error al obtener asistencias:", error);
        res.status(500).json({ error: "Error en el servidor." });
    }
};

exports.agregarAsistencia = (req, res) => {
    const id_campaña = req.body.id_campaña;
    const id_usuario = req.body.id_usuario;
    const fecha = req.body.fecha;
    const hora_Inicio = req.body.hora_Inicio;
    const hora_fin = req.body.hora_fin;
    const horas = req.body.horas;
    const novedades = req.body.novedades;

    const query =
        "INSERT INTO asistencia (id_campaña, id_usuario, fecha, hora_Inicio, hora_fin, horas, novedades) VALUES ( ?, ?, ?, ?, ?, ?, ?)";
    db.query(
        query,
        [id_campaña, id_usuario, fecha, hora_Inicio, hora_fin, horas, novedades],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Error al agregar asistencia" });
            } else {
                res.json({ message: "Asistencia agregada correctamente" });
            }
        }
    );
};

exports.eliminarAsistencia = (req, res) => {
    const id_asistencia = req.params.id;
    const query = "DELETE FROM asistencia WHERE id_asistencia = ?";
    db.query(query, [id_asistencia], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error al eliminar asistencia" });
        } else {
            res.json({ message: "Asistencia eliminada correctamente" });
        }
    });
};

exports.actualizarAsistencia = (req, res) => {
    const id_asistencia = req.body.id_asistencia;
    const id_campaña = req.body.id_campaña;
    const id_usuario = req.body.id_usuario;
    const fecha = req.body.fecha;
    const horas = req.body.horas;

    const query =
        "UPDATE asistencias SET id_campaña = ?, id_usuario = ?, fecha = ?, horas = ? WHERE id_asistencia = ?";
    db.query(query, [id_campaña, id_usuario, fecha, horas, id_asistencia], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error al actualizar asistencia" });
        } else {
            res.json({ message: "Asistencia actualizada correctamente" });
        }
    });
};
