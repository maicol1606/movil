import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import NavegacionAdmin from './NavegacionAdmin';

const DocenteNew = () => {
  const [user, setUser] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    telefono: '',
  });

  const handleChange = (name: string, value: string) => {
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (user.contrasena !== user.confirmarContrasena) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.18:3000/api/docentes/agregarDocente', user);
      if (response.status === 200) {
        Alert.alert('Éxito', response.data.message);
        setUser({
          nombre: '',
          apellido: '',
          correo: '',
          contrasena: '',
          confirmarContrasena: '',
          telefono: '',
        });
      } else {
        Alert.alert('Error', 'Error al crear el Docente');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Error al crear el Docente');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <NavegacionAdmin />
      <Text style={styles.title}>Registrar Nuevo Docente</Text>

      <TextInput
        placeholder="Nombre"
        value={user.nombre}
        onChangeText={value => handleChange('nombre', value)}
        style={styles.input}
      />

      <TextInput
        placeholder="Apellido"
        value={user.apellido}
        onChangeText={value => handleChange('apellido', value)}
        style={styles.input}
      />

      <TextInput
        placeholder="Correo electrónico"
        value={user.correo}
        onChangeText={value => handleChange('correo', value)}
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Teléfono"
        value={user.telefono}
        onChangeText={value => handleChange('telefono', value)}
        keyboardType="numeric"
        style={styles.input}
        maxLength={10}
      />

      <TextInput
        placeholder="Contraseña"
        value={user.contrasena}
        onChangeText={value => handleChange('contrasena', value)}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Confirmar Contraseña"
        value={user.confirmarContrasena}
        onChangeText={value => handleChange('confirmarContrasena', value)}
        secureTextEntry
        style={[
          styles.input,
          user.confirmarContrasena
            ? user.contrasena === user.confirmarContrasena
              ? styles.valid
              : styles.invalid
            : {},
        ]}
      />

      {user.confirmarContrasena && user.contrasena !== user.confirmarContrasena && (
        <Text style={styles.errorText}>Las contraseñas no coinciden.</Text>
      )}
      {user.confirmarContrasena && user.contrasena === user.confirmarContrasena && (
        <Text style={styles.successText}>Las contraseñas coinciden.</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.reset]} onPress={() => setUser({
          nombre: '',
          apellido: '',
          correo: '',
          contrasena: '',
          confirmarContrasena: '',
          telefono: '',
        })}>
          <Text style={styles.buttonText}>Limpiar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DocenteNew;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    color: '#007bff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  valid: {
    borderColor: 'green',
  },
  invalid: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  reset: {
    backgroundColor: '#ccc',
  },
  save: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
