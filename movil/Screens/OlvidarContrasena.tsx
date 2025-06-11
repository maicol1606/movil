import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
    Recuperar: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const OlvidarContrasena: React.FC = () => {
    const [correo, setCorreo] = useState<string>("");
    const navigation = useNavigation<NavigationProp>();

    const handleSubmit = async () => {
        if (!correo) {
            Alert.alert("Error", "Por favor ingrese su correo electrónico");
            return;
        }

        try {
            const res = await axios.post("http://192.168.1.18:3000/api/auth/enviarCodigo", {
                correo,
            });
            console.log(res);
            Alert.alert("Correo Enviado", "Revise su correo electrónico", [
                {
                    text: "Continuar",
                    onPress: () => {
                        // Puedes usar AsyncStorage en lugar de localStorage en React Native
                        // AsyncStorage.setItem('correo', correo);
                        navigation.navigate("Recuperar");
                    },
                },
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Algo salió mal. Intente nuevamente");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Recuperar Contraseña</Text>
                <Text style={styles.subtitle}>
                    Ingrese su correo electrónico para recuperar su cuenta
                </Text>
                <TextInput
                    placeholder="Correo Electrónico"
                    keyboardType="email-address"
                    style={styles.input}
                    value={correo}
                    onChangeText={setCorreo}
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OlvidarContrasena;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        padding: 20,
    },
    card: {
        backgroundColor: "#fff",
        padding: 25,
        borderRadius: 10,
        elevation: 4,
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 10,
        fontWeight: "bold",
        color: "#333",
    },
    subtitle: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
        color: "#666",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#007bff",
        padding: 14,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
});
