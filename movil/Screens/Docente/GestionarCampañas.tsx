import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';

type RootStackParamList = {
  CrearCampaña: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'CrearCampaña'>;

const GestionarCampañas = () => {
  const navigation = useNavigation<NavigationProp>();

  interface Campaña {
    id_campaña: string;
    nom_campaña: string;
    descripcion: string;
    fecha: string;
    cupos: string;
    id_docente: string;
    imagen: string;
  }

  interface Docente {
    id_usuario: string;
    nombre: string;
    apellido: string;
  }

  const [campañas, setCampañas] = useState<Campaña[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [CampañaEdit, setCampañaEdit] = useState<Campaña>({
    id_campaña: '',
    nom_campaña: '',
    descripcion: '',
    fecha: '',
    cupos: '',
    id_docente: '',
    imagen: '',
  });
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleChangeEdit = (name: string, value: string) => {
    setCampañaEdit((prevCampaña) => ({
      ...prevCampaña,
      [name]: value,
    }));
  };

  const handleSubmitEdit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://192.168.1.18:3000/api/campanas/actualizarCampana/${CampañaEdit.id_campaña}`, CampañaEdit);
      if (res.status === 200) {
        Alert.alert('Campaña actualizada', 'La campaña ha sido actualizada', [
          {
            text: 'Aceptar',
            onPress: () => {
              setModalVisible(false);
              navigation.goBack(); 
            },
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error al actualizar la campaña');
    }
  };

  const eliminarCampaña = async (id: string) => {
    Alert.alert('¿Estás seguro de borrar esta campaña?', 'No podrás revertir esta operación', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sí, borrar',
        onPress: async () => {
          try {
            const res = await axios.delete(`http://192.168.1.18:3000/api/campanas/eliminarCampana/${id}`);
            if (res.status === 200) {
              Alert.alert('Campaña borrada', 'La campaña ha sido borrada', [
                {
                  text: 'Aceptar',
                  onPress: () => {
                    navigation.goBack(); 
                  },
                },
              ]);
            }
          } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Error al eliminar la campaña');
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}>Gestionar Campañas</Text>

      <TouchableOpacity
  style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginBottom: 20 }}
  onPress={() => navigation.replace('CrearCampaña')}
>
  <Text style={{ color: 'white', textAlign: 'center' }}>Agregar Nueva Campaña</Text>
</TouchableOpacity>


      <ScrollView>
        {campañas.map((campaña) => (
          <View key={campaña.id_campaña} style={{ flexDirection: 'row', marginBottom: 20 }}>
            <Image
              source={{ uri: `http://192.168.1.18:3000/img/campañas/${campaña.imagen}` }}
              style={{ width: 100, height: 100, borderRadius: 10, marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18 }}>{campaña.nom_campaña}</Text>
              <Text>{campaña.descripcion}</Text>
              <Text>{campaña.cupos} cupos</Text>
              <Text>{moment(campaña.fecha).format('DD/MM/YYYY')}</Text>
              <Text>
                {docentes.find((docente) => docente.id_usuario === campaña.id_docente)?.nombre}{' '}
                {docentes.find((docente) => docente.id_usuario === campaña.id_docente)?.apellido}
              </Text>

              <TouchableOpacity
                style={{ backgroundColor: '#007bff', padding: 5, marginTop: 10 }}
                onPress={() => {
                  setCampañaEdit(campaña);
                  setModalVisible(true);
                }}
              >
                <Text style={{ color: 'white' }}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#dc3545', padding: 5, marginTop: 10 }}
                onPress={() => eliminarCampaña(campaña.id_campaña)}
              >
                <Text style={{ color: 'white' }}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal de edición */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}>Editar Campaña</Text>

          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
            placeholder="Nombre de la campaña"
            value={CampañaEdit.nom_campaña}
            onChangeText={(text) => handleChangeEdit('nom_campaña', text)}
          />

          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
            placeholder="Número de cupos"
            value={CampañaEdit.cupos}
            keyboardType="numeric"
            onChangeText={(text) => handleChangeEdit('cupos', text)}
          />

          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
            placeholder="Descripción"
            value={CampañaEdit.descripcion}
            onChangeText={(text) => handleChangeEdit('descripcion', text)}
          />

          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
            placeholder="Fecha"
            value={moment(CampañaEdit.fecha).format('YYYY-MM-DD')}
            onChangeText={(text) => handleChangeEdit('fecha', text)}
          />

          <TouchableOpacity
            style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginBottom: 20 }}
            onPress={handleSubmitEdit}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: '#6c757d', padding: 10, borderRadius: 5 }}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default GestionarCampañas;
