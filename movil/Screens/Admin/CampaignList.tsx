import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Modal, TextInput, Image, Alert, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import NavegacionAdmin from './NavegacionAdmin';  // Asegúrate de que la ruta sea correcta

export default function CampaignList() {
  const [campañas, setCampañas] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [CampañaEdit, setCampañaEdit] = useState({
    id_campaña: '',
    nom_campaña: '',
    descripcion: '',
    fecha: '',
    cupos: '',
    id_docente: '',
    foto: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campanasRes, docentesRes] = await Promise.all([
          axios.get('http://192.168.1.18:3000/api/campanas/mostrarCampanas'),
          axios.get('http://192.168.1.18:3000/api/docentes/obtenerDocentes'),
        ]);
        setCampañas(campanasRes.data);
        setDocentes(docentesRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleChangeEdit = (name, value) => {
    setCampañaEdit({ ...CampañaEdit, [name]: value });
  };

  const handleSubmitEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('nom_campaña', CampañaEdit.nom_campaña);
      formData.append('descripcion', CampañaEdit.descripcion);
      formData.append('fecha', CampañaEdit.fecha);
      formData.append('cupos', CampañaEdit.cupos);
      formData.append('id_docente', CampañaEdit.id_docente);
      if (CampañaEdit.foto) {
        formData.append('foto', CampañaEdit.foto);
      }

      const res = await axios.put(`http://192.168.1.18:3000/api/campanas/actualizarCampana/${CampañaEdit.id_campaña}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.status === 200) {
        Alert.alert('Success', 'Campaña actualizada');
        setModalVisible(false);
        setCampañaEdit({ ...CampañaEdit, foto: null }); // reset photo
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error al actualizar la campaña');
    }
  };

  const eliminarCampaña = async (id) => {
    try {
      const confirm = await new Promise((resolve) =>
        Alert.alert(
          '¿Estás seguro de borrar esta campaña?',
          'No podrás revertir esta operación',
          [
            { text: 'Cancelar', onPress: () => resolve(false) },
            { text: 'Sí, borrar', onPress: () => resolve(true) },
          ]
        )
      );
      if (confirm) {
        const res = await axios.delete(`http://192.168.1.18:3000/api/campanas/eliminarCampana/${id}`);
        if (res.status === 200) {
          Alert.alert('Success', 'Campaña borrada');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error al eliminar la campaña');
    }
  };

  return (
    <View style={styles.container}>
      {/* Navegación */}
      <NavegacionAdmin />

      <Text style={styles.title}>Lista de Campañas</Text>
      
      <FlatList
        data={campañas}
        keyExtractor={(item) => item.id_campaña.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: `/img/campañas/${item.imagen}` }}
              style={styles.image}
            />
            <Text style={styles.cardTitle}>{item.nom_campaña}</Text>
            <Text style={styles.cardDescription}>{item.descripcion}</Text>
            <Text>{item.cupos} cupos disponibles</Text>
            <Text>{moment(item.fecha).format('DD/MM/YYYY')}</Text>
            <Text>
              Docente: {docentes.find(docente => docente.id_usuario === item.id_docente)?.nombre}
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => { setCampañaEdit(item); setModalVisible(true); }}
              >
                <Button title="Editar" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => eliminarCampaña(item.id_campaña)}>
                <Button title="Eliminar" color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal para Editar Campaña */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Nombre de la campaña"
              value={CampañaEdit.nom_campaña}
              onChangeText={(value) => handleChangeEdit('nom_campaña', value)}
              style={styles.input}
            />
            <TextInput
              placeholder="Descripción"
              value={CampañaEdit.descripcion}
              onChangeText={(value) => handleChangeEdit('descripcion', value)}
              style={styles.input}
            />
            <TextInput
              placeholder="Fecha"
              value={CampañaEdit.fecha}
              onChangeText={(value) => handleChangeEdit('fecha', value)}
              style={styles.input}
            />
            <TextInput
              placeholder="Cupos"
              keyboardType="numeric"
              value={CampañaEdit.cupos}
              onChangeText={(value) => handleChangeEdit('cupos', value)}
              style={styles.input}
            />

            <Button title="Guardar Cambios" onPress={handleSubmitEdit} />
            <Button title="Cerrar" onPress={() => setModalVisible(false)} color="gray" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#007bff',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardDescription: {
    marginBottom: 10,
    color: '#495057',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    margin: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    height: 45,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#495057',
  },
});

