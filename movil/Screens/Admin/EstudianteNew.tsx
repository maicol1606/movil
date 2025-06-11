import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import NavegadorAdmin from './NavegacionAdmin';

interface User {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
  telefono: string;
  curso: string;
}

const EstudianteNew: React.FC = () => {
  const [user, setUser] = useState<User>({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    telefono: '',
    curso: ''
  });

  const handleChange = (name: keyof User, value: string) => {
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (user.contrasena !== user.confirmarContrasena) {
      Alert.alert('Advertencia', 'Las contraseñas no coinciden');
      return;
    }

    try {
      const { confirmarContrasena, ...datosAEnviar } = user;
      const response = await axios.post('http://192.168.1.18:3000/api/auth/registrar', datosAEnviar);

      if (response.status === 200) {
        Alert.alert('Éxito', response.data.message, [
          { text: 'OK', onPress: () => console.log('Usuario registrado') },
        ]);
        setUser({
          nombre: '',
          apellido: '',
          correo: '',
          contrasena: '',
          confirmarContrasena: '',
          telefono: '',
          curso: ''
        });
      } else {
        Alert.alert('Error', 'Error al crear el estudiante');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.title || 'Error al crear el estudiante');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <NavegadorAdmin /> {/* Aquí agregamos el componente NavegadorAdmin */}
      
      <Text style={styles.title}>Registro de Estudiante</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={user.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={user.apellido}
        onChangeText={(text) => handleChange('apellido', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Curso (Ej: 901, 1001)"
        value={user.curso}
        onChangeText={(text) => handleChange('curso', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={user.correo}
        onChangeText={(text) => handleChange('correo', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        maxLength={10}
        value={user.telefono}
        onChangeText={(text) => handleChange('telefono', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={user.contrasena}
        onChangeText={(text) => handleChange('contrasena', text)}
      />
      <TextInput
        style={[
          styles.input,
          user.confirmarContrasena.length > 0 &&
          (user.contrasena !== user.confirmarContrasena ? styles.inputInvalid : styles.inputValid),
        ]}
        placeholder="Confirmar Contraseña"
        secureTextEntry
        value={user.confirmarContrasena}
        onChangeText={(text) => handleChange('confirmarContrasena', text)}
      />

      {user.confirmarContrasena.length > 0 && user.contrasena !== user.confirmarContrasena && (
        <Text style={styles.errorText}>Las contraseñas no coinciden.</Text>
      )}
      {user.confirmarContrasena.length > 0 && user.contrasena === user.confirmarContrasena && (
        <Text style={styles.successText}>Las contraseñas coinciden.</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EstudianteNew;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f7fa',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputValid: {
    borderColor: 'green',
  },
  inputInvalid: {
    borderColor: 'red',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 5,
  },
  successText: {
    color: 'green',
    marginBottom: 10,
    marginLeft: 5,
  },
});
