import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Alert,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
    Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface User {
    nombre: string;
    apellido: string;
    correo: string;
    contrasena: string;
    telefono: string;
    curso: string;
}

const Register: React.FC = () => {
    const [user, setUser] = useState<User>({
        nombre: "",
        apellido: "",
        correo: "",
        contrasena: "",
        telefono: "",
        curso: "",
    });

    const navigation = useNavigation<NavigationProp>();

    const handleChange = (name: keyof User, value: string) => {
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (
            !user.nombre ||
            !user.apellido ||
            !user.correo ||
            !user.contrasena ||
            !user.telefono ||
            !user.curso
        ) {
            Alert.alert("Error", "Por favor, complete todos los campos");
            return;
        }

        try {
            const response = await axios.post("http://192.168.1.18:3000/api/auth/registrar", user);
            if (response.status === 200) {
                Alert.alert("Éxito", response.data.message, [
                    {
                        text: "Ir a Login",
                        onPress: () => navigation.navigate("Login"),
                    },
                ]);
            } else {
                Alert.alert("Error", "Error al registrar el usuario");
            }
        } catch (error: any) {
            const title = error?.response?.data?.title || "Error";
            const message = error?.response?.data?.message || "Error al registrar el usuario";
            Alert.alert(title, message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Regístrate Ahora</Text>
                <Text style={styles.subtitle}>
                    Crea tu cuenta con nosotros y empieza tu servicio social.
                </Text>

                <TextInput
                    placeholder="Nombres"
                    style={styles.input}
                    value={user.nombre}
                    onChangeText={(text) => handleChange("nombre", text)}
                />

                <TextInput
                    placeholder="Apellidos"
                    style={styles.input}
                    value={user.apellido}
                    onChangeText={(text) => handleChange("apellido", text)}
                />

                <TextInput
                    placeholder="Correo"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={user.correo}
                    onChangeText={(text) => handleChange("correo", text)}
                />

                <TextInput
                    placeholder="Contraseña"
                    style={styles.input}
                    secureTextEntry
                    value={user.contrasena}
                    onChangeText={(text) => handleChange("contrasena", text)}
                />

                <TextInput
                    placeholder="Teléfono"
                    style={styles.input}
                    keyboardType="phone-pad"
                    value={user.telefono}
                    onChangeText={(text) => handleChange("telefono", text)}
                />

                <TextInput
                    placeholder="Curso"
                    style={styles.input}
                    keyboardType="number-pad"
                    value={user.curso}
                    onChangeText={(text) => handleChange("curso", text)}
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonSecundario}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={styles.buttonText}>Volver al Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
    },
    card: {
        backgroundColor: "#fff",
        padding: 25,
        borderRadius: 10,
        elevation: 4,
        shadowColor: "#000",
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 10,
        fontWeight: "bold",
        color: "#333",
    },
    subtitle: {
        textAlign: "center",
        marginBottom: 20,
        color: "#666",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#007bff",
        padding: 14,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonSecundario: {
        backgroundColor: "#6c757d",
        padding: 14,
        borderRadius: 8,
        marginTop: 12,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
});
