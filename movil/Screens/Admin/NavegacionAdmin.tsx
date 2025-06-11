import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface ProfileData {
  name: string;
  email: string;
  role: string;
  profilePicture: string;
}

interface OptionItem {
  key: string;
  title: string;
  icon: string;
  color?: string;
  subOptions?: { label: string; route: string }[];
  route?: string;
}

export default function NavegacionAdmin() {
  const navigation = useNavigation<any>();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSubOptions, setShowSubOptions] = useState<{ visible: boolean; options: { label: string; route: string }[] }>({
    visible: false,
    options: [],
  });
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Administrador',
    email: 'admin@gmail.com',
    role: 'Administrador',
    profilePicture: 'https://via.placeholder.com/150',
  });
  const [isEditing, setIsEditing] = useState(false);

  const optionItems: OptionItem[] = [
    { key: 'inicio', title: 'Inicio', icon: 'home-outline', route: 'AdminHome' },
    { key: 'notificaciones', title: 'Notificaciones', icon: 'notifications-outline', route: 'NotificacionesAdmin' },
    {
      key: 'estudiantes',
      title: 'Estudiantes',
      icon: 'people-outline',
      subOptions: [
        { label: 'Ver lista', route: 'EstudianteList' },
        { label: 'Agregar', route: 'EstudianteNew' },
      ],
    },
    {
      key: 'docentes',
      title: 'Docentes',
      icon: 'school-outline',
      subOptions: [
        { label: 'Ver lista', route: 'DocenteList' },
        { label: 'Agregar', route: 'DocenteNew' },
      ],
    },
    {
      key: 'campañas',
      title: 'Campañas',
      icon: 'megaphone-outline',
      subOptions: [
        { label: 'Ver campañas', route: 'CampaignList' },
        { label: 'Crear campaña', route: 'CampaignNew' },
      ],
    },
    {
      key: 'salir',
      title: 'Cerrar sesión',
      icon: 'exit-outline',
      color: '#ff5252',
      route: 'Login',
    },
  ];

  const handleInputChange = (name: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionPress = (item: OptionItem) => {
    if (item.subOptions) {
      setShowSubOptions({ visible: true, options: item.subOptions });
    } else if (item.route) {
      navigation.navigate(item.route);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowProfileModal(true)} style={styles.profileButton}>
          <Image source={{ uri: profileData.profilePicture }} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hola, {profileData.name}</Text>
      </View>

      {/* Scroll horizontal de tarjetas */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {optionItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.card, item.color ? { backgroundColor: item.color } : {}]}
            onPress={() => handleOptionPress(item)}
          >
            <Icon name={item.icon} size={30} color={item.color ? '#fff' : '#333'} />
            <Text style={[styles.cardText, item.color ? { color: '#fff' } : {}]}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal de subopciones */}
      <Modal visible={showSubOptions.visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setShowSubOptions({ visible: false, options: [] })}
        >
          <View style={styles.subOptionBox}>
            {showSubOptions.options.map((opt, i) => (
              <TouchableOpacity
                key={i}
                style={styles.subOption}
                onPress={() => {
                  setShowSubOptions({ visible: false, options: [] });
                  navigation.navigate(opt.route);
                }}
              >
                <Text style={styles.subOptionText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de perfil */}
      <Modal visible={showProfileModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image source={{ uri: profileData.profilePicture }} style={styles.modalAvatar} />
            {isEditing ? (
              <>
                <TextInput style={styles.input} value={profileData.name} onChangeText={(text) => handleInputChange('name', text)} />
                <TextInput style={styles.input} value={profileData.email} onChangeText={(text) => handleInputChange('email', text)} />
                <TouchableOpacity style={styles.modalButton} onPress={() => setIsEditing(false)}>
                  <Text style={styles.modalButtonText}>Guardar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalText}>{profileData.name}</Text>
                <Text style={styles.modalText}>{profileData.email}</Text>
                <TouchableOpacity style={styles.modalButton} onPress={() => setIsEditing(true)}>
                  <Text style={styles.modalButtonText}>Editar</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#ccc' }]} onPress={() => setShowProfileModal(false)}>
              <Text style={[styles.modalButtonText, { color: '#000' }]}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: '#f2f2f2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#1a73e8',
  },
  profileButton: {
    marginRight: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    width: 110,
    height: 100,
    elevation: 20,
  },
  cardText: {
    marginTop: 6,
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000aa',
  },
  subOptionBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    width: '75%',
  },
  subOption: {
    paddingVertical: 6,
  },
  subOptionText: {
    fontSize: 14,
    textAlign: 'center',
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
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 15,
    marginVertical: 3,
  },
  input: {
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: 6,
    padding: 4,
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
});
