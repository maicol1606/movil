import React from 'react';
import { View, Text, Alert, StyleSheet, ScrollView, Button, SafeAreaView } from 'react-native';
import NavegadorDocente from './NavegadorDocente';

const HomeDocentes: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Navegador Docente */}
      <View style={styles.navbar}>
        <NavegadorDocente />
      </View>

      {/* Contenido principal */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Bienvenido al Sistema de Gestión de Servicios Sociales</Text>

        {/* Alerta - Usando el componente de Alert de React Native */}
        <View style={styles.alert}>
          <Text style={styles.alertText}>
            <Text style={{ fontWeight: 'bold' }}>¡Bienvenido!</Text> Aquí puedes gestionar las horas de servicio social de los estudiantes y gestionar campañas.
          </Text>
        </View>

        {/* Información */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>¿Cómo Funciona el Sistema?</Text>
          <Text>
            Este sistema está diseñado para ayudarte a gestionar las horas de servicio social de los estudiantes y administrar campañas. Aquí podrás subir tus solicitudes de acompañamiento.
          </Text>
        </View>

        {/* Button de ejemplo */}
        <Button title="Gestionar Campañas" onPress={() => {}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', 
  },
  navbar: {
    height: 190, 
  },
  content: {
    flexGrow: 1,
    padding: 16,
    marginTop: 10, 
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
  },
  alert: {
    backgroundColor: '#d1ecf1',
    padding: 16,
    marginBottom: 16,
    borderRadius: 4,
  },
  alertText: {
    fontSize: 16,
    color: '#0c5460',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default HomeDocentes;
