import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const NavegadorEstudiante = () => {
  const navigation = useNavigation<any>();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>('/img/navegacion/Avatar2.png');
  const [studentData, setStudentData] = useState({
    nombre: 'Estudiante',
    campaña: 'Campaña Actual',
    horas: '50',
    telefono: '1234567890',
    correo: 'estudiante@example.com',
  });

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleEditClick = () => {
    setShowProfileModal(false);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowProfileModal(false);
    setShowEditModal(false);
  };

  const optionItems = [
    { key: 'verHoras', title: 'Ver horas', icon: 'clock-outline', route: 'Horas' },
    { key: 'infoCampaña', title: 'Información de la campaña', icon: 'information-circle-outline', route: 'InfoCampaña' },
    { key: 'listaCampañas', title: 'Lista de campañas', icon: 'list-outline', route: 'ListaCampañas' },
    { key: 'notificaciones', title: 'Notificaciones', icon: 'notifications-outline', route: 'Notificaciones' },
    { key: 'certificados', title: 'Certificados', icon: 'clipboard-outline', route: 'Certificados' },
    { key: 'cerrarSesion', title: 'Cerrar sesión', icon: 'exit-outline', route: 'Login' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleProfileClick}>
          <Image source={{ uri: profileImage || '/img/navegacion/Avatar2.png' }} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hola, {studentData.nombre}</Text>
      </View>

      {/* Scroll horizontal de opciones */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {optionItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.card}
            onPress={() => {
              console.log(`Navigating to ${item.route}`);
              // Verifica que la ruta está definida correctamente antes de navegar
              if (item.route) {
                navigation.navigate(item.route);
              }
            }}
          >
            <Icon name={item.icon} size={30} color="#333" />
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal Ver Perfil */}
      <Modal visible={showProfileModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Perfil del Estudiante</Text>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeModal}>Cerrar</Text>
            </TouchableOpacity>
            <Image source={{ uri: profileImage || '/img/navegacion/Avatar2.png' }} style={styles.profileImageLarge} />
            <Text><strong>Nombre:</strong> {studentData.nombre}</Text>
            <Text><strong>Campaña:</strong> {studentData.campaña}</Text>
            <Text><strong>Horas:</strong> {studentData.horas}</Text>
            <Text><strong>Teléfono:</strong> {studentData.telefono}</Text>
            <Text><strong>Correo:</strong> {studentData.correo}</Text>
            <TouchableOpacity onPress={handleEditClick}>
              <Text style={styles.modalButton}>Editar perfil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Editar Perfil */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeModal}>Cerrar</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={studentData.nombre}
              onChangeText={(text) => setStudentData((prev) => ({ ...prev, nombre: text }))} />
            <TextInput
              style={styles.input}
              value={studentData.correo}
              onChangeText={(text) => setStudentData((prev) => ({ ...prev, correo: text }))} />
            <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Guardar cambios</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1a73e8',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    width: 100,
    height: 100,
    elevation: 5,
  },
  cardText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000aa',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    width: '75%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeModal: {
    color: '#007bff',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#1a73e8',
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  profileImageLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: 10,
    padding: 6,
  },
});

export default NavegadorEstudiante;
