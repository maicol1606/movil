import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  Image, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import NavegadorAdmin from './NavegacionAdmin';

export default function CampaignNew() {
  const [Campaña, setCampaña] = useState({
    nom_campana: '',
    descripcion: '',
    fecha: '',
    cupos: '',
    id_docente: '', // AQUI el id deberías traerlo de AsyncStorage o similar
    foto: null as any
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (name: string, value: string) => {
    setCampaña(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.img,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setPreview(asset.uri);
      setCampaña(prev => ({
        ...prev,
        foto: {
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName || 'photo.jpg'
        }
      }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('nom_campana', Campaña.nom_campana);
    formData.append('descripcion', Campaña.descripcion);
    formData.append('fecha', Campaña.fecha);
    formData.append('cupos', Campaña.cupos);
    formData.append('id_docente', Campaña.id_docente);
    if (Campaña.foto) {
      formData.append('foto', {
        uri: Campaña.foto.uri,
        name: Campaña.foto.name,
        type: 'image/jpeg'
      } as any);
    }

    try {
      const res = await axios.post('http://192.168.1.18:3000/api/campanas/agregarCampana', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.status === 200) {
        Alert.alert('Éxito', res.data.title);
        setCampaña({
          nom_campana: '',
          descripcion: '',
          fecha: '',
          cupos: '',
          id_docente: '',
          foto: null
        });
        setPreview(null);
      } else {
        Alert.alert('Error', 'Error al crear la campaña');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'No se pudo crear la campaña');
    }
  };

  return (
    <View style={styles.screen}>
      <NavegadorAdmin />
      
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Nueva Campaña</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de la campaña"
          value={Campaña.nom_campana}
          onChangeText={(text) => handleChange('nom_campana', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Número de cupos"
          keyboardType="numeric"
          value={Campaña.cupos}
          onChangeText={(text) => handleChange('cupos', text)}
        />

        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Descripción"
          value={Campaña.descripcion}
          multiline
          numberOfLines={4}
          onChangeText={(text) => handleChange('descripcion', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Fecha (YYYY-MM-DD)"
          value={Campaña.fecha}
          onChangeText={(text) => handleChange('fecha', text)}
        />

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Seleccionar Foto</Text>
        </TouchableOpacity>

        {preview && (
          <Image source={{ uri: preview }} style={styles.image} />
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
