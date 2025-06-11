import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
    Home: undefined;
    AdminHome: undefined;
    HomeEstudiante: undefined;
    HomeDocente: undefined;
    Register: undefined;
    OlvidarContrasena: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface UserLogin {
    correo: string;
    contrasena: string;
}

const Login: React.FC = () => {
    const [user, setUser] = useState<UserLogin>({
        correo: "",
        contrasena: "",
    });
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation<NavigationProp>();

    const handleChange = (name: keyof UserLogin, value: string) => {
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post("http://192.168.1.18:3000/api/auth/login", user);
            if (response.status === 200) {
                Alert.alert("Éxito", response.data.message, [
                    {
                        text: "Continuar",
                        onPress: () => {
                            const { token, rol } = response.data;

                            switch (rol) {
                                case 1:
                                    navigation.navigate("AdminHome");
                                    break;
                                case 2:
                                    navigation.navigate("HomeEstudiante");
                                    break;
                                case 3:
                                    navigation.navigate("HomeDocente");
                                    break;
                                default:
                                    navigation.navigate("Home");
                            }
                        },
                    },
                ]);
            }
        } catch (error: any) {
            const title = error?.response?.data?.title || "Error";
            console.error(error);
            Alert.alert(title, "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Iniciar Sesión</Text>

                <TextInput
                    placeholder="Correo"
                    value={user.correo}
                    onChangeText={(text) => handleChange("correo", text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />

                <TextInput
                    placeholder="Contraseña"
                    value={user.contrasena}
                    onChangeText={(text) => handleChange("contrasena", text)}
                    secureTextEntry
                    style={styles.input}
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? "Cargando..." : "Ingresar"}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("OlvidarContrasena")}>
                    <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.link}>¿Aún no tienes una cuenta? Regístrate</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonSecundario}
                    onPress={() => navigation.navigate("Home")}
                >
                    <Text style={styles.buttonText}>Volver al inicio</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EAF0F6",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    card: {
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        marginBottom: 24,
        textAlign: "center",
        fontWeight: "bold",
        color: "#2C3E50",
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d1d1",
        borderRadius: 10,
        padding: 14,
        marginBottom: 16,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    button: {
        backgroundColor: "#3498db",
        paddingVertical: 14,
        borderRadius: 10,
        marginBottom: 12,
        shadowColor: "#3498db",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonSecundario: {
        backgroundColor: "#95a5a6",
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 16,
        shadowColor: "#95a5a6",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "600",
        fontSize: 16,
    },
    link: {
        color: "#2980b9",
        textAlign: "center",
        marginTop: 10,
        fontSize: 14,
        textDecorationLine: "underline",
    },
});
