const db = require('../config/db');

const obtenerEstadisticas = (req, res) => {
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM usuarios WHERE id_rol = 2 ) AS total,
      (SELECT COUNT(*) FROM postulacion) AS postulados,
      (SELECT COUNT(*) FROM usuarios WHERE id_rol = 2 AND estado = 1) AS enProceso,
      (SELECT COUNT(*) FROM usuarios WHERE id_rol = 2 AND estado = 0) AS finalizados
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(' Error en la consulta:', err);
      return res.status(500).json({ error: 'Error al obtener estadísticas' });
    }

    const { total, postulados, enProceso, finalizados } = results[0];

    res.json({ total, postulados, enProceso, finalizados });
  });
};

module.exports = {
  obtenerEstadisticas,
};
