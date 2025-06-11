import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import NavegadorAdmin from './NavegacionAdmin'; 

interface EstudianteList {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  curso: string;
}

const EstudianteList: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<EstudianteList[]>([]);

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const res = await axios.get('http://192.168.1.18:3000/api/estudiantes/llamarEstudiantes');
        setEstudiantes(res.data);
      } catch (error) {
        console.error('Error al obtener estudiantes:', error);
      }
    };

    fetchEstudiantes();
  }, []);

  const eliminarEstudiante = (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de borrar al estudiante?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí, borrar', onPress: async () => await handleDelete(id) },
      ],
      { cancelable: false }
    );
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await axios.delete(`http://192.168.1.18:3000/api/estudiantes/eliminarEstudiante/${id}`);
      if (res.status === 200) {
        Alert.alert('Estudiante borrado', 'El estudiante ha sido borrado');
        setEstudiantes(prevEstudiantes => prevEstudiantes.filter(estudiante => estudiante.id_usuario !== id));
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error al eliminar al estudiante');
    }
  };

  const handleEdit = (id: number) => {
    console.log(`Editar usuario con ID: ${id}`);
  };

  const renderItem = ({ item }: { item: EstudianteList }) => (
    <View style={styles.row}>
      <View style={styles.details}>
        <Text style={styles.textBold}>{item.nombre} {item.apellido}</Text>
        <Text style={styles.text}>{item.correo}</Text>
        <Text style={styles.text}>{item.telefono}</Text>
        <Text style={styles.text}>{item.curso}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item.id_usuario)}>
          <Ionicons name="pencil" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => eliminarEstudiante(item.id_usuario)}>
          <Ionicons name="trash" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <NavegadorAdmin /> 
      
      <Text style={styles.header}>Listado de estudiantes en plataforma</Text>
      <FlatList
        data={estudiantes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_usuario.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,  // Shadow for Android
    shadowColor: '#000',  // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: '#777',
    fontSize: 14,
    marginBottom: 5,
  },
  textBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
  },
});

export default EstudianteList;
