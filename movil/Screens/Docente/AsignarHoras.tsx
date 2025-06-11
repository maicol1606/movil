import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Modal, StyleSheet } from 'react-native';
import axios from 'axios';

interface Estudiante {
  id_usuario: number;
  nombre: string;
  horas: any[];
  historial: any[];
}

const AsignarHoras = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<Estudiante | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [novedades, setNovedades] = useState('');
  const [nuevasHoras, setNuevasHoras] = useState('');
  const [fecha, setFecha] = useState('');

  const [modalMensaje, setModalMensaje] = useState('');
  const [tipoModal, setTipoModal] = useState('success');

  useEffect(() => {
    const obtenerEstudiantes = async () => {
      try {
        const res = await axios.get('http://192.168.1.18:3000/api/estudiantes/obtenerEstudiantes');
        console.log("Estudiantes obtenidos:", res.data); 
        setEstudiantes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    obtenerEstudiantes();
  }, []); 

  const seleccionarEstudiante = (idUsuario: number) => {
    const estudiante = estudiantes.find(e => e.id_usuario === idUsuario);
    if (estudiante) {
      setEstudianteSeleccionado(estudiante);
      setMostrarFormulario(true);
    }
  };

  const enviarAsistencia = async () => {
    if (!horaInicio || !horaFin || isNaN(Number(nuevasHoras)) || Number(nuevasHoras) < 1 || Number(nuevasHoras) > 6) {
      setTipoModal('error');
      setModalMensaje("Completa todos los campos correctamente.");
      setMostrarModal(true);
      return;
    }

    if (!estudianteSeleccionado) {
      setTipoModal('error');
      setModalMensaje("No se ha seleccionado un estudiante.");
      setMostrarModal(true);
      return;
    }

    try {
      await axios.post('http://192.168.1.18:3000/api/asistencia/agregarAsistencia', {
        id_usuario: estudianteSeleccionado.id_usuario,
        id_campaña: estudianteSeleccionado.id_campaña,
        fecha,
        hora_Inicio: horaInicio,
        hora_fin: horaFin,
        horas: nuevasHoras,
        novedades
      });
      setTipoModal('success');
      setModalMensaje("Asistencia registrada correctamente.");
      setMostrarModal(true);
      setMostrarFormulario(false);

      setHoraInicio('');
      setHoraFin('');
      setNovedades('');
      setNuevasHoras('');
      setFecha('');

      const res = await axios.get('http://192.168.1.18:3000/api/estudiantes/obtenerEstudiantes');
      setEstudiantes(res.data);
    } catch (error) {
      console.error(error);
      setTipoModal('error');
      setModalMensaje("Error al registrar asistencia.");
      setMostrarModal(true);
    }
  };

  const calcularHoras = (inicio: string, fin: string) => {
    if (!inicio || !fin) return;

    const [hInicio, mInicio] = inicio.split(':').map(Number);
    const [hFin, mFin] = fin.split(':').map(Number);

    const minutosInicio = hInicio * 60 + mInicio;
    const minutosFin = hFin * 60 + mFin;

    let diferenciaHoras = (minutosFin - minutosInicio) / 60;

    if (diferenciaHoras <= 0) {
      setNuevasHoras(''); // o puedes mostrar error
    } else if (diferenciaHoras > 6) {
      setNuevasHoras('6'); // máximo permitido
    } else {
      setNuevasHoras(String(Math.floor(diferenciaHoras)));
    }
  };

  useEffect(() => {
    calcularHoras(horaInicio, horaFin);
  }, [horaInicio, horaFin]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Modal de mensaje */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={mostrarModal}
        onRequestClose={() => setMostrarModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{tipoModal === 'success' ? 'Éxito' : 'Error'}</Text>
            <Text>{modalMensaje}</Text>
            <Button title="Cerrar" onPress={() => setMostrarModal(false)} />
          </View>
        </View>
      </Modal>

      {/* Lista de estudiantes */}
      <Text style={styles.title}>Seleccionar Estudiante</Text>
      <FlatList
        data={estudiantes}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Button
              title="Ver Detalles"
              onPress={() => seleccionarEstudiante(item.id_usuario)}
            />
          </View>
        )}
        keyExtractor={item => item.id_usuario.toString()}
      />

      {/* Formulario para registrar asistencia */}
      {mostrarFormulario && estudianteSeleccionado && (
        <View style={styles.formContainer}>
          <Text style={styles.title}>Registrar Asistencia</Text>
          <TextInput
            style={styles.input}
            placeholder="Fecha"
            value={fecha}
            onChangeText={setFecha}
            keyboardType="default"
          />
          <TextInput
            style={styles.input}
            placeholder="Hora de Inicio"
            value={horaInicio}
            onChangeText={setHoraInicio}
            keyboardType="time"
          />
          <TextInput
            style={styles.input}
            placeholder="Hora de Fin"
            value={horaFin}
            onChangeText={setHoraFin}
            keyboardType="time"
          />
          <TextInput
            style={styles.input}
            placeholder="Horas"
            value={nuevasHoras}
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Novedades"
            value={novedades}
            onChangeText={setNovedades}
            keyboardType="default"
          />
          <Button title="Guardar Asistencia" onPress={enviarAsistencia} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default AsignarHoras;
