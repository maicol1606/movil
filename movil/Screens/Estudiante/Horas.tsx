import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';  // Importación correcta
import NavegacionEstudiante from './NavegadorEstudiante';

const Horas: React.FC = () => {
  const [asistencias, setAsistencias] = useState<any[]>([]);
  const [horasTotales] = useState(120); 
  const idEstudiante = '123'; 

  const fetchDatos = async () => {
    try {
      const res = await axios.get(`http://192.168.1.18:3000/api/asistencia/mostrarAsistencias/${idEstudiante}`);
      setAsistencias(res.data);
    } catch (err) {
      console.error('Error al cargar los datos del estudiante', err);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const novedadesInvalidas = ['no porta el carnet', 'no asistió', 'no hace uso del uniforme'];

  
  const horasValidas = asistencias
    .filter((a: any) => !novedadesInvalidas.includes(a.novedades?.toLowerCase()))
    .reduce((total, a) => total + a.horas, 0) || 0;

  // Filtra las horas con novedad
  const horasConNovedad = asistencias
    .filter((a: any) => novedadesInvalidas.includes(a.novedades?.toLowerCase()))
    .reduce((total, a) => total + a.horas, 0) || 0;

  // Calcula las horas extra
  const horasExtra = horasValidas > horasTotales ? horasValidas - horasTotales : 0;

  // Total de horas no válidas (con novedad + extra)
  const horasNoValidas = horasExtra + horasConNovedad;

  return (
    <View style={styles.container}>
      {/* Barra de Navegación */}
      <View style={styles.navBar}>
        <NavegacionEstudiante />
      </View>

      {/* Contenido de las horas */}
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Gestión de Horas de Servicio Social</Text>
        
        {/* Resumen de horas */}
        <View style={styles.summary}>
          <View style={styles.card}>
            <Ionicons name="timer-outline" size={40} color="#4CAF50" />
            <Text style={styles.cardTitle}>Total de Horas a realizar</Text>
            <Text style={styles.cardValue}>{horasTotales} horas</Text>
          </View>

          <View style={styles.card}>
            <Ionicons name="checkmark-circle-outline" size={40} color="#8BC34A" />
            <Text style={styles.cardTitle}>Horas Realizadas</Text>
            <Text style={styles.cardValue}>{horasValidas} horas</Text>
          </View>

          <View style={styles.card}>
            <Ionicons name="alert-circle-outline" size={40} color="#FF5722" />
            <Text style={styles.cardTitle}>Horas Extra</Text>
            <Text style={styles.cardValue}>{horasNoValidas} horas</Text>
          </View>
        </View>

        {/* Tabla de registro de horas */}
        <Text style={styles.tableTitle}>Registro de Horas</Text>
        <FlatList
          data={asistencias}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.cell}>{new Date(item.fecha).toLocaleDateString()}</Text>
              <Text style={styles.cell}>{new Date(`1970-01-01T${item.hora_Inicio}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              <Text style={styles.cell}>{new Date(`1970-01-01T${item.hora_fin}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              <Text style={styles.cell}>{item.horas}</Text>
              <Text style={styles.cell}>{item.novedades || '—'}</Text>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    flexDirection: 'column',
  },
  navBar: {
    height: 190,
    backgroundColor: '#2196F3', 
  },
  content: {
    flex: 1, 
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  card: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    width: 110,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#555',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tableTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cell: {
    width: '20%',
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
  },
});

export default Horas;
