import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PostulacionesDocente = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [isDataUpdated, setIsDataUpdated] = useState(false);

  const token = localStorage.getItem('token');
  const decoded_token = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const idDocente = decoded_token?.id;

  const navigation = useNavigation();

  useEffect(() => {
    const obtenerPostulaciones = async () => {
      try {
        setIsDataUpdated(true);
        const response = await axios.get(`http://192.168.1.18:3000/api/postulacion/mostrarPostulacionesPorDocente/${idDocente}`);
        setPostulaciones(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    obtenerPostulaciones();
    setIsDataUpdated(false);
  }, [isDataUpdated, idDocente]);

  const postulacionesPendientes = postulaciones.filter((postulacion) => postulacion.estado_postulacion === 'pendiente');
  const postulacionesAceptadas = postulaciones.filter((postulacion) => postulacion.estado_postulacion === 'aceptada');
  const postulacionesRechazadas = postulaciones.filter((postulacion) => postulacion.estado_postulacion === 'rechazada');

  const handleAceptar = async (idPostulacion: number, correo: string) => {
    try {
      Alert.alert(
        'Confirmación',
        '¿Desea aceptar la postulación?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Aceptar',
            onPress: async () => {
              const response = await axios.put(`http://192.168.1.18:3000/api/postulacion/aceptarPostulacion/${idPostulacion}`, { correo });
              if (response.status === 200) {
                Alert.alert('Postulación aceptada', '', [{ text: 'OK' }]);
                setIsDataUpdated(true);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleRechazar = async (idPostulacion: number, correo: string) => {
    try {
      Alert.alert(
        'Confirmación',
        '¿Desea rechazar la postulación?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Rechazar',
            onPress: async () => {
              const response = await axios.put(`http://192.168.1.18:3000/api/postulacion/rechazarPostulacion/${idPostulacion}`, { correo });
              if (response.status === 200) {
                Alert.alert('Postulación rechazada', '', [{ text: 'OK' }]);
                setIsDataUpdated(true);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const renderPostulacionItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text><strong>{item.nombre} {item.apellido}</strong> se ha postulado a <strong>{item.nom_campaña}</strong></Text>
      <View style={styles.buttonsContainer}>
        {item.estado_postulacion === 'pendiente' && (
          <>
            <Button title="Aceptar" onPress={() => handleAceptar(item.id_postulacion, item.correo)} />
            <Button title="Rechazar" onPress={() => handleRechazar(item.id_postulacion, item.correo)} />
          </>
        )}
        {item.estado_postulacion === 'aceptada' && <Text>Postulación aceptada</Text>}
        {item.estado_postulacion === 'rechazada' && <Text>Postulación rechazada</Text>}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Postulaciones</Text>
      
      <Text style={styles.subHeader}>Postulaciones pendientes</Text>
      <FlatList
        data={postulacionesPendientes}
        renderItem={renderPostulacionItem}
        keyExtractor={(item) => item.id_postulacion.toString()}
      />

      <Text style={styles.subHeader}>Postulaciones aceptadas</Text>
      <FlatList
        data={postulacionesAceptadas}
        renderItem={renderPostulacionItem}
        keyExtractor={(item) => item.id_postulacion.toString()}
      />

      <Text style={styles.subHeader}>Postulaciones rechazadas</Text>
      <FlatList
        data={postulacionesRechazadas}
        renderItem={renderPostulacionItem}
        keyExtractor={(item) => item.id_postulacion.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  card: {
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
  },
  buttonsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PostulacionesDocente;
