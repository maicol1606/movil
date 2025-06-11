import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Usar react-navigation para navegar entre pantallas

interface User {
    correo: string | null;
    codigo: string;
    contrasena: string;
    confirmarContrasena: string;
}

export default function Recuperar() {
    const navigation = useNavigation(); // Hook para la navegación en React Native
    const [user, setUser] = useState<User>({
        correo: null,
        codigo: "",
        contrasena: "",
        confirmarContrasena: "",
    });

    // Cargar el correo desde AsyncStorage cuando se monta el componente
    useEffect(() => {
        const loadCorreo = async () => {
            const storedCorreo = await AsyncStorage.getItem("correo");
            setUser((prevUser) => ({ ...prevUser, correo: storedCorreo }));
        };

        loadCorreo();
    }, []);

    const handleChange = (name: string, value: string) => {
        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        if (user.contrasena !== user.confirmarContrasena) {
            Alert.alert("Error", "Las contraseñas no coinciden");
            return;
        }

        try {
            const res = await axios.put("http://192.168.1.18:3000/api/auth/recuperar", user, {
                headers: { "Content-Type": "application/json" },
            });

            console.log(user);

            if (res.status === 200) {
                Alert.alert("Éxito", "Contraseña actualizada con éxito", [
                    { text: "OK", onPress: () => navigation.navigate("Login") },
                ]);
            }
        } catch (error: any) {
            console.error(error);
            if (error.response) {
                Alert.alert(
                    "Error",
                    `Hubo un problema con la solicitud: ${
                        error.response.data.message || "Error desconocido"
                    }`
                );
            } else {
                Alert.alert("Error", "Algo salió mal al actualizar la contraseña");
            }
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
                Recuperar Contraseña
            </Text>

            <TextInput
                style={{
                    height: 40,
                    borderColor: "gray",
                    borderWidth: 1,
                    marginBottom: 20,
                    paddingLeft: 10,
                }}
                placeholder="Código"
                value={user.codigo}
                onChangeText={(text) => handleChange("codigo", text)}
            />

            <TextInput
                style={{
                    height: 40,
                    borderColor: "gray",
                    borderWidth: 1,
                    marginBottom: 20,
                    paddingLeft: 10,
                }}
                placeholder="Nueva Contraseña"
                secureTextEntry
                value={user.contrasena}
                onChangeText={(text) => handleChange("contrasena", text)}
            />

            <TextInput
                style={{
                    height: 40,
                    borderColor: "gray",
                    borderWidth: 1,
                    marginBottom: 20,
                    paddingLeft: 10,
                }}
                placeholder="Confirmar Contraseña"
                secureTextEntry
                value={user.confirmarContrasena}
                onChangeText={(text) => handleChange("confirmarContrasena", text)}
            />

            <Button title="Enviar" onPress={handleSubmit} />
        </View>
    );
}
