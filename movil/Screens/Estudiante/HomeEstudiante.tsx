import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
const jwtDecode = require('jwt-decode');
import NavegadorEstudiante from './NavegadorEstudiante';
import { NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';  


interface HomeEstudianteProps {
  navigation: NavigationProp<any, any>; 
}

const HomeEstudiante: React.FC<HomeEstudianteProps> = ({ navigation }) => {  
  const [campanas, setCampanas] = useState<any[]>([]);
  const [docentes, setDocentes] = useState<any[]>([]);
  const [postulaciones, setPostulaciones] = useState<any[]>([]);
  const [postulado, setPostulado] = useState<{ id_usuario: string | null; id_campaña: string }>({
    id_usuario: null,
    id_campaña: '',
  });
  const [showPostuladoModal, setShowPostuladoModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedCampaignIndex, setSelectedCampaignIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const tokenDecoded = token ? jwtDecode(token) : null;
        const idUsuario = tokenDecoded?.id ?? null;

        const [campanasRes, postulacionesRes, docentesRes] = await Promise.all([
          axios.get('http://192.168.1.18:3000/api/campanas/mostrarCampanas'),
          axios.get(`http://192.168.1.18:3000/api/postulacion/mostrarPostulacion/${idUsuario}`),
          axios.get('http://192.168.1.18:3000/api/docentes/obtenerDocentes'),
        ]);

        setCampanas(campanasRes.data);
        setPostulaciones(postulacionesRes.data);
        setDocentes(docentesRes.data);
        setPostulado(prev => ({ ...prev, id_usuario: idUsuario }));

        if (postulacionesRes.data.length > 0) {
          Alert.alert(
            'Ya postulaste',
            'Ya has postulado para una campaña.',
            [
              {
                text: 'Ir a horas',
                onPress: () => {
                  navigation.navigate('Horas');
                },
              },
            ]
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [navigation]);

  const handlePostular = async () => {
    try {
      const response = await axios.post('http://192.168.1.18:3000/api/postulacion/agregarPostulacion', postulado);

      if (response.status === 200) {
        Alert.alert('Éxito', 'Has postulado correctamente para la campaña.', [
          {
            text: 'Ir a horas',
            onPress: () => {
              navigation.navigate('Horas');
            },
          },
        ]);
        setTimeout(() => {
          setShowPostuladoModal(false);
        }, 300);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Error al postular');
    }
  };

  const handleVerInfo = (index: number) => {
    setSelectedCampaignIndex(index);
    setShowInfoModal(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <NavegadorEstudiante />
      <Text style={styles.title}>Campañas</Text>
      <Text style={styles.subtitle}>El servicio social es una oportunidad para marcar la diferencia.</Text>

      {campanas.map((campana, index) => {
        const docente = docentes.find((doc: any) => doc.id_usuario === campana.id_docente);
        return (
          <View key={campana.id_campañas} style={styles.card}>
            <Image
              source={{ uri: `http://192.168.1.18:3000/img/campañas/${campana.imagen}` }}
              style={styles.image}
            />
            <Text style={styles.campaignTitle}>{campana.nom_campaña}</Text>
            <Text>{campana.descripcion}</Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Inicio:</Text> {moment(campana.fecha_inicio).format('DD/MM/YYYY')}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Cupos:</Text> {campana.cupos}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Docente:</Text> {docente?.nombre} {docente?.apellido}
            </Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.postularBtn}
                onPress={() => {
                  setPostulado({ id_usuario: postulado.id_usuario, id_campaña: campana.id_campaña });
                  setShowPostuladoModal(true);
                }}
              >
                <Text style={styles.btnText}>Postularse</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.verBtn} onPress={() => handleVerInfo(index)}>
                <Text style={styles.btnText}>Ver</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {/* Modal de confirmación */}
      <Modal visible={showPostuladoModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Confirmas la postulación?</Text>
            <Text style={styles.modalText}>Esta acción es irreversible.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowPostuladoModal(false)}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handlePostular}>
                <Text style={styles.btnText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de información */}
      {showInfoModal && selectedCampaignIndex !== null && (
        <Modal visible={showInfoModal} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Información de la campaña</Text>
              <Text style={styles.modalText}>{campanas[selectedCampaignIndex].descripcion}</Text>
              <TouchableOpacity style={styles.confirmBtn} onPress={() => setShowInfoModal(false)}>
                <Text style={styles.btnText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  image: {
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  campaignTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    marginVertical: 2,
  },
  label: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  postularBtn: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
  },
  verBtn: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  confirmBtn: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    flex: 1,
  },
});

export default HomeEstudiante;
