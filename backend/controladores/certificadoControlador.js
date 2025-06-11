const db = require('../config/db');
exports.agregarCertificado = async (req, res) => {
    const { id_usuario, id_campaña, descripcion } = req.body;
  const fecha_generacion = new Date();

  try {
    await db.query(
      "INSERT INTO certificado (id_usuario, id_campaña, fecha_generacion, descripcion) VALUES (?, ?, ?, ?)",
      [id_usuario, id_campaña, fecha_generacion, descripcion]
    );
    res.status(200).json({ message: "Certificado registrado exitosamente." });
  } catch (error) {
    console.error("Error al registrar certificado:", error);
    res.status(500).json({ error: "Error al registrar el certificado." });
  }
};

exports.mostrarCertificados = (req, res) => {
    db.query('SELECT * FROM certificados', (error, results) => {
        if (error) {
            console.error('Error al obtener los certificados:', error);
            res.status(500).json({ error: 'Error al obtener los certificados' });
        } else {
            res.status(200).send(results);
        }
    });
};

exports.eliminarCertificado = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM certificados WHERE id_certificado = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el certificado:', error);
            res.status(500).json({ error: 'Error al eliminar el certificado' });
        } else {
            res.status(200).json({ message: 'Certificado eliminado correctamente' });
        }
    });
};

exports.actualizarCertificado = (req, res) => {
    const id_certificado = req.params.id_certificado;
    const id_asistencia = req.body.id_asistencia;
    const observaciones = req.body.observaciones;
    const id_usuario = req.body.id_usuario;
    const query = 'UPDATE certificados SET id_asistencia = ?, observaciones = ?, id_usuario = ? WHERE id_certificado = ?';
    db.query(query, [id_asistencia, observaciones, id_usuario, id_certificado], (error, results) => {
        if (error) { 
            console.error('Error al actualizar el certificado:', error);
            res.status(500).json({ error: 'Error al actualizar el certificado' });
        } else {
            res.status(200).json({ message: 'Certificado actualizado correctamente' });
        }
    });
};