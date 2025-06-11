import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import Pdf from 'react-native-pdf-lib';
import NavegadorEstudiante from './NavegadorEstudiante';  // Importar el componente NavegadorEstudiante

const Certificados: React.FC = () => {
  const [identificacion, setIdentificacion] = useState('');
  const [generado, setGenerado] = useState(false);

  const generarCertificado = () => {
    if (identificacion) {
      setGenerado(true);
    } else {
      Alert.alert('Por favor, complete todos los campos antes de generar el certificado.');
    }
  };

  const descargarCertificado = () => {
    const doc = Pdf.PDFDocument.create();
    const page = doc.addPage([595.28, 841.89]);

    page.drawText('¡Certificado Generado Exitosamente!', { x: 20, y: 800, fontSize: 20, color: '#002855' });
    page.drawText('Certificado de Servicio Social', { x: 20, y: 770, fontSize: 16, color: '#003366' });

    const texto1 = `Este certificado acredita que el estudiante identificado con documento N° ${identificacion} ha completado satisfactoriamente SU SERVICIO SOCIAL en la institución educativa Fernando Gonzalez Ochoa.`;
    const texto2 = `Se ha validado su presencia y participación de manera correcta, es por eso que este certificado es entregado a usted:`;
    const texto3 = `• Cumplimiento en su servicio social`;
    const texto4 = `¡Felicidades por completar tu servicio social y continuar con tu formación!`;

    page.drawText(texto1, { x: 20, y: 740, fontSize: 12, color: '#333' });
    page.drawText(texto2, { x: 20, y: 710, fontSize: 12, color: '#333' });
    page.drawText(texto3, { x: 20, y: 680, fontSize: 12, color: '#333' });
    page.drawText(texto4, { x: 20, y: 650, fontSize: 12, color: '#333' });

    const pdfPath = `${RNFS.DocumentDirectoryPath}/certificado_servicio_social.pdf`;
    doc.writeToFile(pdfPath).then(() => {
      console.log('PDF generado en: ' + pdfPath);
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Navegador Estudiante al principio */}
      <NavegadorEstudiante />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Listo para generar tu certificado en línea</Text>
        <Text style={styles.headerText}>
          Ya puedes generar tu certificado de manera online, sin tener que esperar en largas filas.
        </Text>
        <TouchableOpacity style={styles.button} onPress={generarCertificado}>
          <Text style={styles.buttonText}>Genera tu certificado</Text>
        </TouchableOpacity>
      </View>

      {generado ? (
        <View style={styles.certificadoContainer}>
          <Text style={styles.certificadoTitle}>¡Certificado Generado Exitosamente!</Text>
          <View style={styles.card}>
            <Text style={styles.certificadoText}>
              Este certificado acredita que el estudiante identificado con documento N°{' '}
              <Text style={styles.certificadoHighlight}>{identificacion}</Text> ha completado satisfactoriamente{' '}
              <Text style={styles.certificadoHighlight}>SU SERVICIO SOCIAL</Text> en la institución educativa
              Fernando Gonzalez Ochoa.
            </Text>
            <Text style={styles.certificadoText}>Se ha validado su presencia y participación de manera correcta.</Text>
            <Text style={styles.certificadoText}>• Cumplimiento en su servicio social</Text>
            <Text style={styles.certificadoText}>
              ¡Felicidades por completar tu servicio social y continuar con tu formación!
            </Text>
            <TouchableOpacity style={styles.downloadButton} onPress={descargarCertificado}>
              <Ionicons name="download-outline" size={20} color="#fff" />
              <Text style={styles.downloadButtonText}>Descargar Certificado</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Número de identificación</Text>
          <TextInput
            style={styles.input}
            value={identificacion}
            onChangeText={setIdentificacion}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={generarCertificado}>
            <Text style={styles.buttonText}>Generar certificado</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    backgroundColor: '#002855',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#004a99',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  certificadoContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    borderColor: '#004a99',
    borderWidth: 2,
    marginTop: 20,
  },
  certificadoTitle: {
    color: '#002855',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    borderColor: '#d4af37',
    borderWidth: 1,
  },
  certificadoText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  certificadoHighlight: {
    fontWeight: 'bold',
    color: '#004a99',
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#004a99',
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default Certificados;
