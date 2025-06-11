import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import NavegacionAdmin from "./NavegacionAdmin";

interface Estadisticas {
  total?: number;
  finalizados?: number;
  enProceso?: number;
  postulados?: number;
}

interface Estudiante {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  curso: string;
}

const AdminHome: React.FC = () => {
  const [datos, setDatos] = useState<Estadisticas>({});
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);

  useEffect(() => {
    axios.get("http://192.168.1.18:3000/api/obtenerEstadisticas")
      .then(res => setDatos(res.data))
      .catch(err => console.error("Error al cargar estadísticas:", err));

    axios.get("http://192.168.1.18:3000/api/estudiantes/llamarEstudiantes")
      .then(res => setEstudiantes(res.data))
      .catch(err => {
        console.error("Error al obtener estudiantes:", err);
        setEstudiantes([]);
      });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <NavegacionAdmin />

      <Text style={styles.header}>📊 Panel de Estadísticas</Text>

      <View style={styles.statsContainer}>
        <View style={[styles.card, { backgroundColor: "#6c757d" }]}>
          <Text style={styles.cardTitle}>Total Estudiantes</Text>
          <Text style={styles.cardValue}>{datos.total ?? 0}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#28a745" }]}>
          <Text style={styles.cardTitle}>Finalizados</Text>
          <Text style={styles.cardValue}>{datos.finalizados ?? 0}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#ffc107" }]}>
          <Text style={styles.cardTitle}>En Proceso</Text>
          <Text style={styles.cardValue}>{datos.enProceso ?? 0}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#007bff" }]}>
          <Text style={styles.cardTitle}>Postulados</Text>
          <Text style={styles.cardValue}>{datos.postulados ?? 0}</Text>
        </View>
      </View>

      <Text style={styles.header}>📋 Lista de Estudiantes</Text>

      <View style={styles.table}>
        {estudiantes.map((usuario, index) => (
          <View
            key={usuario.id_usuario}
            style={[
              styles.tableRow,
              { backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#e9ecef" },
            ]}
          >
            <Text style={styles.cell}>{index + 1}</Text>
            <Text style={styles.cell}>{usuario.nombre}</Text>
            <Text style={styles.cell}>{usuario.apellido}</Text>
            <Text style={styles.cell}>{usuario.correo}</Text>
            <Text style={styles.cell}>{usuario.telefono}</Text>
            <Text style={styles.cell}>{usuario.curso}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f1f3f5",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
    color: "#343a40",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  card: {
    width: "48%",
    padding: 20,
    borderRadius: 15,
    marginBottom: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  cardValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  table: {
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  cell: {
    width: "33%",
    padding: 4,
    fontSize: 14,
    color: "#212529",
  },
});

export default AdminHome;
