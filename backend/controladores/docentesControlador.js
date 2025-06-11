const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.obtenerDocentes = (req, res) => {
    db.query('SELECT * FROM usuarios where id_rol = 3 and estado = 1', (error, results) => {
        if (error) {
            console.error('Error al obtener los docentes:', error);
            res.status(500).json({ error: 'Error al obtener los docentes' });
        } else {
            res.status(200).send(results);
        }
    });
}
exports.obtenerPerfilDocente = async (req, res) => {
    try {
        const docenteId = req.usuario.id; // Este valor viene del middleware de autenticación

        // Selecciona explícitamente los campos que deseas devolver
        const docente = await Docente.findById(docenteId)
            .select('nombre correo telefono');

        if (!docente) {
            return res.status(404).json({ mensaje: 'Docente no encontrado' });
        }

        res.json({ docente });
    } catch (error) {
        console.error('Error al obtener perfil del docente:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};


exports.agregarDocente = (req, res) => {
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const correo = req.body.correo;
    const contrasena = req.body.contrasena;
    const contrasenaEncriptada = bcrypt.hashSync(contrasena, 10);
    const telefono = req.body.telefono;
    const query1 = 'SELECT * FROM usuarios WHERE correo = ?';

    db.query(query1, [correo], (error, results) => {
        if (error) {
            console.error('Error al obtener el usuario:', error);
            res.status(500).send({ error: 'Error al obtener el usuario' });
        } else if (results.length > 0) {
            res.status(400).send({ title: 'El correo ya está registrado' });
        }
        else {
            const query = 'INSERT INTO usuarios (nombre, apellido, correo, contrasena, telefono , id_rol) VALUES ( ?, ?, ?, ?, ?,3)';
            db.query(query, [nombre, apellido, correo, contrasenaEncriptada, telefono, ], (error, results) => {
                if (error) {
                    console.error('Error al registrar el usuario:', error);
                    res.status(500).send({ error: 'Error al registrar el usuario' });
                } else {
                    res.status(200).send({ title: 'Registro exitoso', message: 'Usuario registrado correctamente' });
                }
            });
        }
    });

}

exports.actualizarDocente = (req, res) => {
    const id = req.params.id;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const correo = req.body.correo;
    const telefono = req.body.telefono;
    const qdocente = 'SELECT * FROM usuarios WHERE id_usuario = ?';

    db.query(qdocente, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el docente:', error);
            res.status(500).json({ error: 'Error al obtener el docente' });
        }

        else if (results.length === 0) {
            res.status(404).json({ error: 'Docente no encontrado' });
        }

        const docenteActual = results[0];
        const nombreActual = nombre || docenteActual.nombre;
        const apellidoActual = apellido || docenteActual.apellido;
        const correoActual = correo || docenteActual.correo;
        const telefonoActual = telefono || docenteActual.telefono;

        const query = 'UPDATE usuarios SET nombre = ?, apellido = ?, correo = ?, telefono = ? WHERE id_usuario = ?';

        db.query(query, [nombreActual, apellidoActual, correoActual, telefonoActual, id], (error, results) => {
            if (error) {
                console.error('Error al actualizar el docente:', error);
                res.status(500).json({ error: 'Error al actualizar el docente' });   
            } else {
                res.status(200).json({ message: 'Docente actualizado correctamente' });
            }
        }); 

        })
}
        exports.eliminarDocente = (req, res) => {
            const id = req.params.id;
            const query = 'UPDATE usuarios SET estado = 0 WHERE id_usuario = ?';
        
            db.query(query, [id], (error, results) => {
                if (error) {
                    console.error('Error al eliminar el docente:', error);
                    res.status(500).json({ error: 'Error al eliminar el docente' });
                } else {
                    res.status(200).json({ message: 'Docente eliminado correctamente' });
                }
            });
}

exports.restaurarDocente = (req, res) => {
    const id = req.params.id;
    const query = 'UPDATE usuarios SET estado = 1 WHERE id_usuario = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al restaurar el docente:', error);
            res.status(500).json({ error: 'Error al restaurar el docente' });
        } else {
            res.status(200).json({ message: 'Docente restaurado correctamente' });
        }
    });
}

exports.conteoDocentes = (req, res) => {
    const query = 'SELECT COUNT(*) as total FROM usuarios WHERE id_rol = 3 and estado = 1';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener el conteo de docentes:', error);
            res.status(500).json({ error: 'Error al obtener el conteo de docentes' });
        } else {
            res.status(200).json({ total: results[0].total });
        }
    });
}

exports.agregarHoras = (req, res) => {
    const id = req.params.id;
    const horas = req.body.horas;
    const query = 'UPDATE asistencias SET horas = ? AND fecha = ? WHERE id_usuario = ?';
    db.query(query, [horas, id], (error, results) => {
        if (error) {
            console.error('Error al agregar las horas:', error);
            res.status(500).json({ error: 'Error al agregar las horas' });
        } else {
            res.status(200).json({ message: 'Horas agregadas correctamente' });
        }
    });
}