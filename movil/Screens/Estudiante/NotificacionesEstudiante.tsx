import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import NavegacionEstudiante from './NavegadorEstudiante'; // Componente de navegación del estudiante

interface Notificacion {
  id: number;
  idEstudiante: string;
  nombre_estudiante: string;
  campaña: string;
  fecha_postulacion: string;
  estado: string;
}

const NotificacionesEstudiante = () => {
  const [notifications, setNotifications] = useState<Notificacion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [campaignFilter, setCampaignFilter] = useState('');
  const [alert, setAlert] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'danger'>('success');
  const [showModal, setShowModal] = useState(false);
  const [modalNotification, setModalNotification] = useState<Notificacion | null>(null);

  useEffect(() => {
    axios
      .get('http://192.168.1.18:3000/api/notificaciones') // Cambia por el endpoint adecuado
      .then((res) => {
        if (Array.isArray(res.data)) {
          setNotifications(res.data);
        } else {
          console.error('La respuesta de la API no es un array');
        }
      })
      .catch((err) => {
        console.error('Error al obtener notificaciones:', err.response || err.message);
      });
  }, []);

  const handleAccept = (id: number) => {
    axios
      .put(`http://192.168.1.18:3000/api/notificaciones/${id}`, { estado: 'Aceptado' })
      .then(() => {
        setAlertType('success');
        setAlert('✅ Notificación aceptada correctamente');
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id ? { ...notification, estado: 'Aceptado' } : notification
          )
        );
        setTimeout(() => setAlert(''), 3000);
      })
      .catch(() => {
        setAlertType('danger');
        setAlert('❌ Error al aceptar la notificación');
        setTimeout(() => setAlert(''), 3000);
      });
  };

  const handleReject = (id: number) => {
    axios
      .put(`http://192.168.1.18:3000/api/notificaciones/${id}`, { estado: 'Rechazado' })
      .then(() => {
        setAlertType('danger');
        setAlert('🚫 Notificación rechazada');
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id ? { ...notification, estado: 'Rechazado' } : notification
          )
        );
        setTimeout(() => setAlert(''), 3000);
      })
      .catch(() => {
        setAlertType('danger');
        setAlert('❌ Error al rechazar la notificación');
        setTimeout(() => setAlert(''), 3000);
      });
  };

  const showDetails = (notification: Notificacion) => {
    setModalNotification(notification);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalNotification(null);
  };

  const filteredNotifications = notifications.filter((n) => {
    const search = searchTerm.toLowerCase();
    return (
      (!searchTerm ||
        n.nombre_estudiante?.toLowerCase().includes(search) ||
        n.campaña?.toLowerCase().includes(search) ||
        String(n.id)?.includes(search) ||
        String(n.idEstudiante)?.includes(search)) &&
      (!campaignFilter || n.campaña === campaignFilter)
    );
  });

  return (
    <>
      <NavegacionEstudiante /> {/* Aquí insertamos la navegación para el estudiante */}
      <ScrollView style={styles.container}>
        <Text style={styles.header}>📬 Notificaciones de Postulación</Text>
        <Text style={styles.subHeader}>Tienes {notifications.length} notificaciones en total</Text>

        {alert && (
          <Text style={alertType === 'success' ? styles.successAlert : styles.dangerAlert}>
            {alert}
          </Text>
        )}

        <View style={styles.filtersContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Buscar por nombre, campaña o ID"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="📌 Filtrar por campaña"
            value={campaignFilter}
            onChangeText={setCampaignFilter}
          />
        </View>

        {filteredNotifications.map((item) => (
          <View key={item.id} style={styles.notificationContainer}>
            <Text style={styles.notificationText}>👤 Nombre: {item.nombre_estudiante}</Text>
            <Text style={styles.notificationText}>🆔 ID Estudiante: {item.idEstudiante}</Text>
            <Text style={styles.notificationText}>📢 Campaña: {item.campaña}</Text>
            <Text style={styles.notificationText}>📅 Fecha: {item.fecha_postulacion}</Text>
            <Text style={styles.notificationText}>📌 Estado: {item.estado}</Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item.id)}>
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.id)}>
                <Text style={styles.buttonText}>Rechazar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.detailButton} onPress={() => showDetails(item)}>
                <Text style={styles.buttonText}>Ver Detalles</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Modal visible={showModal} transparent animationType="fade" onRequestClose={closeModal}>
          <View style={styles.modalBackground}>
            <View style={styles.modalCard}>
              {modalNotification && (
                <>
                  <Text style={styles.modalTitle}>📄 Detalles de la Notificación</Text>
                  <Text>ID: {modalNotification.id}</Text>
                  <Text>Nombre: {modalNotification.nombre_estudiante}</Text>
                  <Text>ID Estudiante: {modalNotification.idEstudiante}</Text>
                  <Text>Campaña: {modalNotification.campaña}</Text>
                  <Text>Fecha: {modalNotification.fecha_postulacion}</Text>
                  <Text>Estado: {modalNotification.estado}</Text>
                  <TouchableOpacity style={styles.closeModalBtn} onPress={closeModal}>
                    <Text style={styles.buttonText}>Cerrar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0a3d62',
  },
  subHeader: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 15,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 45,
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  notificationContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  notificationText: {
    fontSize: 14,
    marginBottom: 3,
    color: '#2f3640',
  },
  buttonsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  acceptButton: {
    backgroundColor: '#2ecc71',
    padding: 8,
    borderRadius: 8,
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 8,
  },
  detailButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 8,
  },
  closeModalBtn: {
    backgroundColor: '#34495e',
    marginTop: 15,
    padding: 8,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  successAlert: {
    color: '#27ae60',
    fontSize: 14,
    marginBottom: 10,
  },
  dangerAlert: {
    color: '#c0392b',
    fontSize: 14,
    marginBottom: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
});

export default NotificacionesEstudiante;
