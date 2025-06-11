import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons'; 
import NavegadorAdmin from './NavegacionAdmin'; 

// Tipos de rutas
type RootStackParamList = {
  EstudianteList: undefined;
  EditarEstudiante: { id: number }; // Recibe un ID
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EstudianteList'>;

interface Estudiante {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
}

const EstudianteList: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [filtro, setFiltro] = useState<string>('');
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const estudiantesPorPagina = 6;

  useEffect(() => {
    const fetchDocente = async () => {
      try {
        const res = await axios.get('http://192.168.1.18:3000/api/docentes/obtenerDocentes');
        setEstudiantes(res.data);
      } catch (error) {
        console.error('Error al obtener estudiantes:', error);
      }
    };

    fetchDocente();
  }, []);

  const eliminarEstudiante = (id: number) => {
    Alert.alert(
      '¿Estás seguro?',
      'Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive', 
          onPress: async () => {
            try {
              const res = await axios.delete(`http://192.168.1.18:3000/api/docentes/eliminarDocente/${id}`);
              if (res.status === 200) {
                Alert.alert('Eliminado', 'El estudiante fue eliminado.');
                setEstudiantes(prev => prev.filter(est => est.id_usuario !== id));
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Hubo un problema al eliminar.');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (id: number) => {
    navigation.navigate('EditarEstudiante', { id });
  };

  const estudiantesFiltrados = estudiantes.filter((est) =>
    `${est.nombre} ${est.apellido} ${est.correo}`.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPaginas = Math.ceil(estudiantesFiltrados.length / estudiantesPorPagina);
  const inicio = (paginaActual - 1) * estudiantesPorPagina;
  const estudiantesPaginados = estudiantesFiltrados.slice(inicio, inicio + estudiantesPorPagina);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const renderItem = ({ item }: { item: Estudiante }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.nombre} {item.apellido}</Text>
      <Text><Text style={styles.label}>Correo:</Text> {item.correo}</Text>
      <Text><Text style={styles.label}>Teléfono:</Text> {item.telefono}</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item.id_usuario)}>
          <FontAwesome name="edit" size={20} color="#1e40af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => eliminarEstudiante(item.id_usuario)}>
          <FontAwesome name="trash" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <NavegadorAdmin />
      <Text style={styles.header}>Listado de Docentes</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre, apellido o correo..."
        value={filtro}
        onChangeText={setFiltro}
      />

      {estudiantesPaginados.length > 0 ? (
        <FlatList
          data={estudiantesPaginados}
          keyExtractor={(item) => item.id_usuario.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noData}>No se encontraron docentes.</Text>
      )}

      <View style={styles.pagination}>
        <TouchableOpacity onPress={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>
          <Text style={styles.pageButton}>Anterior</Text>
        </TouchableOpacity>

        <Text style={styles.pageInfo}>Página {paginaActual} de {totalPaginas}</Text>

        <TouchableOpacity onPress={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>
          <Text style={styles.pageButton}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EstudianteList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0ECFF',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
    color: '#1e40af',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  label: {
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    borderColor: '#1e40af',
    borderWidth: 1,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    borderColor: 'red',
    borderWidth: 1,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  pageButton: {
    fontSize: 16,
    color: '#1e40af',
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
