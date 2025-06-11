const db = require("../config/db");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

module.exports = class UsuarioControlador {
    static async crearUsuario(req, res) {
        try {
            const usuario = req.body;
            const query =
                "INSERT INTO usuarios (nombre, apellido, correo, contrasena, telefono, curso , id_rol, estado) VALUES ( ?, ?, ?, ?, ?, ?,2, 1)";

            const [rows] = await db
                .promise()
                .query(query, [
                    usuario.nombre,
                    usuario.apellido,
                    usuario.correo,
                    bcrypt.hashSync(usuario.contrasena, 10),
                    usuario.telefono,
                    usuario.curso,
                    usuario.id_rol,
                ]);

            res.status(200).json({
                success: true,
                message: "Usuario creado correctamente",
                data: rows,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al crear usuario: " + error.message,
            });
        }
    }
    static async obtenerUsuarios(req, res) {
        try {
            const query =
                "SELECT usuarios.*, roles.nombre as rol_nombre FROM usuarios INNER JOIN roles ON usuarios.id_rol = roles.id_rol";
            const [rows] = await db.promise().query(query);

            res.status(200).json({
                success: true,
                message: "Usuarios obtenidos correctamente",
                data: rows,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al obtener usuarios: " + error.message,
            });
        }
    }

    static async obtenerUsuario(req, res) {
        try {
            const { id } = req.params;
            const query =
                "SELECT usuarios.*, roles.nombre as rol_nombre FROM usuarios INNER JOIN roles ON usuarios.id_rol = roles.id_rol WHERE id_usuario = ?";
            const [rows] = await db.promise().query(query, [id]);

            let user = rows[0];

            // Campañas si es estudiante
            if (user.id_rol === 2) {
                const query = `
                    SELECT 
                        c.*,
                        COALESCE(SUM(a.horas), 0) as total_horas
                    FROM campañas c
                    INNER JOIN asistencia a ON c.id_campaña = a.id_campaña 
                    WHERE a.id_usuario = ?
                    GROUP BY c.id_campaña
                    ORDER BY c.nom_campaña
                `;
                const [campañas] = await db.promise().query(query, [id]);
                user.campañas = campañas;
            }

            res.status(200).json({
                success: true,
                message: "Usuario obtenido correctamente",
                data: user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al obtener usuario: " + error.message,
            });
        }
    }

    static async actualizarUsuario(req, res) {
        try {
            const { id } = req.params;
            let usuario = req.body;

            if (req.file) {
                const nombreFoto = `${id}.jpg`;
                const tempPath = req.file.path;
                const newPath = path.join(
                    __dirname,
                    "../../frontend/public/img/usuarios",
                    nombreFoto
                );
                fs.renameSync(tempPath, newPath);
                usuario.foto = "/img/usuarios/" + nombreFoto;
            }

            let query = "UPDATE usuarios SET ";

            for (const key in usuario) {
                if (usuario[key] !== undefined) {
                    query += ` ${key} = ?, `;
                }
            }

            query = query.slice(0, -2);
            query += " WHERE id_usuario = ?";

            const [rows] = await db.promise().query(query, [...Object.values(usuario), id]);

            res.status(200).json({
                success: true,
                message: "Usuario actualizado correctamente",
                data: rows,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al actualizar usuario: " + error.message,
                error: error.message,
            });
        }
    }

    static async eliminarUsuario(req, res) {
        try {
            const { id } = req.params;
            const query = "UPDATE usuarios SET estado = 0 WHERE id_usuario = ?";
            const [rows] = await db.promise().query(query, [id]);

            res.status(200).json({
                success: true,
                message: "Usuario eliminado correctamente",
                data: rows,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al eliminar usuario: " + error.message,
            });
        }
    }

    static async restaurarUsuario(req, res) {
        try {
            const { id } = req.params;
            const query = "UPDATE usuarios SET estado = 1 WHERE id_usuario = ?";
            const [rows] = await db.promise().query(query, [id]);

            res.status(200).json({
                success: true,
                message: "Usuario restaurado correctamente",
                data: rows,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al restaurar usuario: " + error.message,
            });
        }
    }
};
