const db = require("../config/db");
const path = require("path");
const fs = require("fs");

exports.obtenerEstudiantes = async (req, res) => {
    const query = `
        SELECT usuarios.*, postulacion.id_campaña 
        FROM usuarios 
        INNER JOIN postulacion ON usuarios.id_usuario = postulacion.id_usuario 
        WHERE usuarios.id_rol = 2 AND usuarios.estado = 1
    `;

    const results = await db.promise().query(query);

    res.status(200).json(results);
};

exports.obtenerEstudiante = async (req, res) => {
    const id = req.params.id;

    const query = `
        SELECT 
            u.*,
            c.id_campaña,
            c.nom_campaña,
            SUM(a.horas) AS total_horas
        FROM usuarios u
        LEFT JOIN asistencia a ON u.id_usuario = a.id_usuario
        LEFT JOIN campañas c ON a.id_campaña = c.id_campaña
        WHERE u.id_usuario = ?
        GROUP BY c.id_campaña
        ORDER BY c.nom_campaña;
    `;

    const [results] = await db.promise().query(query, [id]);

    res.status(200).json({
        id_usuario: results[0].id_usuario,
        nombre: results[0].nombre,
        apellido: results[0].apellido,
        correo: results[0].correo,
        telefono: results[0].telefono,
        curso: results[0].curso,
        estado: results[0].estado,
        codigo_verificacion: results[0].codigo_verificacion,
        foto: results[0].foto,
        campañas: results.map((r) => ({
            id_campaña: r.id_campaña,
            nom_campaña: r.nom_campaña,
            total_horas: r.total_horas || 0,
        })),
    });
};

exports.llamarEstudiantes = (req, res) => {
    const query = "SELECT * FROM usuarios WHERE id_rol = 2 and estado = 1";
    db.query(query, (error, results) => {
        if (error) {
            console.error("Error al obtener los estudiantes:", error);
            res.status(500).json({ error: "Error al obtener los estudiantes" });
        } else {
            res.status(200).json(results); // usa .json en vez de .send por consistencia
        }
    });
};

exports.obtenerAsistenciaEstudiante = (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT 
  u.id_usuario AS id_usuario,
  CONCAT(u.nombre, ' ', u.apellido) AS nombre_completo,
  a.horas,
  a.fecha,
  a.novedades
FROM usuarios u
JOIN asistencia a ON u.id_usuario = a.id_usuario
WHERE u.id_usuario = ?;
    `;

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: "Error al obtener datos" });

        if (results.length === 0)
            return res.status(404).json({ error: "Estudiante no encontrado" });

        // Estructura clara del estudiante con su historial de asistencia
        const estudiante = {
            id_usuario: results[0].id_usuario,
            nombre: results[0].nombre,
            apellido: results[0].apellido,
            asistencia: results.map((r) => ({
                horas: r.horas,
                dia: r.fecha, // Aquí estamos usando 'fecha' en lugar de 'dia' para mayor claridad
                novedades: r.novedades,
            })),
        };

        res.json(estudiante);
    });
};

exports.actualizarEstudiante = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, correo, telefono, curso } = req.body;

        // Input validation
        if (!id) {
            return res.status(400).json({ error: "ID del estudiante es requerido" });
        }

        // Get current student data
        const [estudianteActual] = await db
            .promise()
            .query("SELECT * FROM usuarios WHERE id_usuario = ?", [id]);

        if (!estudianteActual.length) {
            return res.status(404).json({ error: "Estudiante no encontrado" });
        }

        // Prepare update data using nullish coalescing
        const datosActualizados = {
            nombre: nombre ?? estudianteActual[0].nombre,
            apellido: apellido ?? estudianteActual[0].apellido,
            correo: correo ?? estudianteActual[0].correo,
            telefono: telefono ?? estudianteActual[0].telefono,
            curso: curso ?? estudianteActual[0].curso,
        };

        if (req.file) {
            const nombreFoto = `${id}.jpg`;
            const tempPath = req.file.path;
            const newPath = path.join(__dirname, "../../frontend/public/img/usuarios", nombreFoto);
            fs.renameSync(tempPath, newPath);
            datosActualizados.foto = "/img/usuarios/" + nombreFoto;

            await db
                .promise()
                .query("UPDATE usuarios SET foto = ? WHERE id_usuario = ?", [
                    datosActualizados.foto,
                    id,
                ]);
        }

        // Update student
        await db
            .promise()
            .query(
                "UPDATE usuarios SET nombre = ?, apellido = ?, correo = ?, telefono = ?, curso = ? WHERE id_usuario = ?",
                [
                    datosActualizados.nombre,
                    datosActualizados.apellido,
                    datosActualizados.correo,
                    datosActualizados.telefono,
                    datosActualizados.curso,
                    id,
                ]
            );

        return res.status(200).json({
            message: "Estudiante actualizado correctamente",
            data: datosActualizados,
        });
    } catch (error) {
        console.error("Error al actualizar el estudiante:", error);
        return res.status(500).json({
            error: "Error al actualizar el estudiante",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

exports.eliminarEstudiante = (req, res) => {
    const id = req.params.id;
    const query = "UPDATE usuarios SET estado = 0 WHERE id_usuario = ?";
    db.query(query, [id], (error, results) => {
        if (error) {
            console.error("Error al eliminar el estudiante:", error);
            res.status(500).json({ error: "Error al eliminar el estudiante" });
        } else {
            res.status(200).json({ message: "Estudiante eliminado correctamente" });
        }
    });
};

exports.restaurarEstudiante = (req, res) => {
    const id = req.params.id;
    const query = "UPDATE usuarios SET estado = 1 WHERE id_usuario = ?";
    db.query(query, [id], (error, results) => {
        if (error) {
            console.error("Error al restaurar el estudiante:", error);
            res.status(500).json({ error: "Error al restaurar el estudiante" });
        } else {
            res.status(200).json({ message: "Estudiante restaurado correctamente" });
        }
    });
};

exports.conteoEstudiantes = (req, res) => {
    const query = "SELECT COUNT(*) as total FROM usuarios WHERE id_rol = 2 and estado = 1";
    db.query(query, (error, results) => {
        if (error) {
            console.error("Error al obtener el conteo de estudiantes:", error);
            res.status(500).json({ error: "Error al obtener el conteo de estudiantes" });
        } else {
            res.status(200).json({ total: results[0].total });
        }
    });
};

exports.mostrarHorasEstudiante = (req, res) => {
    const id = req.params.id;
    const fecha = req.params.fecha;
    const query = "SELECT * FROM asistencia WHERE id_usuario = ?";
    db.query(query, [id], (error, results) => {
        if (error) {
            console.error("Error al obtener las horas del estudiante:", error);
            res.status(500).json({ error: "Error al obtener las horas del estudiante" });
        } else {
            res.status(200).send(results);
        }
    });
};

exports.certificar = async (req, res) => {
    try {
        const { id } = req.params;
        const { certificacion_documento } = req.body;

        const [rows] = await db
            .promise()
            .query("SELECT * FROM postulacion WHERE id_usuario = ? AND estado = 'aceptada'", [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontró la postulación del estudiante",
            });
        }

        const id_postulacion = rows[0].id_postulacion;

        let certificacion;

        const [rowsFind] = await db
            .promise()
            .query("SELECT * FROM certificacion WHERE id_usuario = ?", [id]);

        if (rowsFind.length == 0) {
            const query =
                "INSERT INTO certificacion (id_usuario, id_postulacion, certificacion_documento, certificacion_fecha) VALUES (?, ?, ?, ?)";
            const result = await db
                .promise()
                .query(query, [
                    id,
                    id_postulacion,
                    certificacion_documento,
                    new Date().toISOString().split("T")[0],
                ]);

            const [rowsNew] = await db
                .promise()
                .query("SELECT * FROM certificacion WHERE id_usuario = ?", [id]);

            certificacion = rowsNew[0];
        } else {
            certificacion = rowsFind[0];

            if (rowsFind[0].certificacion_documento !== certificacion_documento) {
                return res.status(400).json({
                    success: false,
                    message:
                        "El número de identificación no coincide con el número de identificación del estudiante: " +
                        rowsFind[0].certificacion_documento,
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: "Estudiante certificado correctamente",
            data: certificacion,
        });
    } catch (error) {
        console.error("Error al certificar al estudiante:", error);
        return res.status(500).json({
            success: false,
            message: "Error al certificar al estudiante",
        });
    }
};

exports.obtenerCertificaciones = async (req, res) => {
    const query =
        "SELECT certificacion.*, usuarios.nombre, usuarios.apellido, campañas.nom_campaña, usuarios.curso FROM certificacion INNER JOIN usuarios ON certificacion.id_usuario = usuarios.id_usuario INNER JOIN postulacion ON certificacion.id_postulacion = postulacion.id_postulacion INNER JOIN campañas ON postulacion.id_campaña = campañas.id_campaña";
    const [rows] = await db.promise().query(query);

    return res.status(200).json({
        success: true,
        message: "Certificaciones obtenidas correctamente",
        data: rows,
    });
};
