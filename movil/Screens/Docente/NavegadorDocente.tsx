import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    TextInput,
    StyleSheet,
    ScrollView,
    SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import CerrarSesion from "../hooks/CerrarSesion";

const NavegadorDocente = () => {
    const navigation = useNavigation<any>();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>("/img/navegacion/Avatar2.png");
    const [docenteData, setDocenteData] = useState({
        nombre: "Docente",
        telefono: "1234567890",
        correo: "docente@example.com",
    });

    const handleProfileClick = () => {
        setShowProfileModal(true);
    };

    const handleEditClick = () => {
        setShowProfileModal(false);
        setShowEditModal(true);
    };

    const closeModal = () => {
        setShowProfileModal(false);
        setShowEditModal(false);
    };

    const optionItems = [
        { key: "asignarHoras", title: "Asignar Horas", icon: "time", route: "AsignarHoras" },
        {
            key: "gestionarCampanas",
            title: "Gestionar Campañas",
            icon: "list",
            route: "GestionarCampañas",
        },
        {
            key: "notificaciones",
            title: "Notificaciones",
            icon: "notifications",
            route: "Notificaciones",
        },
        { key: "cerrarSesion", title: "Cerrar sesión", icon: "exit", route: "Login" },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleProfileClick}>
                    <Image
                        source={{ uri: profileImage || "/img/navegacion/Avatar2.png" }}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hola, {docenteData.nombre}</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {optionItems.map((item) => (
                    <TouchableOpacity
                        key={item.key}
                        style={styles.card}
                        onPress={() => {
                            console.log(`Navigating to ${item.route}`);
                            if (item.route) {
                                navigation.navigate(item.route);
                            }
                        }}
                    >
                        <Icon name={item.icon} size={30} color="#333" />
                        <Text style={styles.cardText}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Modal Ver Perfil */}
            <Modal visible={showProfileModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Perfil del Docente</Text>
                        <TouchableOpacity onPress={closeModal}>
                            <Text style={styles.closeModal}>Cerrar</Text>
                        </TouchableOpacity>
                        <Image
                            source={{ uri: profileImage || "/img/navegacion/Avatar2.png" }}
                            style={styles.profileImageLarge}
                        />
                        <Text>
                            <strong>Nombre:</strong> {docenteData.nombre}
                        </Text>
                        <Text>
                            <strong>Teléfono:</strong> {docenteData.telefono}
                        </Text>
                        <Text>
                            <strong>Correo:</strong> {docenteData.correo}
                        </Text>
                        <TouchableOpacity onPress={handleEditClick}>
                            <Text style={styles.modalButton}>Editar perfil</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Editar Perfil */}
            <Modal visible={showEditModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Perfil</Text>
                        <TouchableOpacity onPress={closeModal}>
                            <Text style={styles.closeModal}>Cerrar</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            value={docenteData.nombre}
                            onChangeText={(text) =>
                                setDocenteData((prev) => ({ ...prev, nombre: text }))
                            }
                        />
                        <TextInput
                            style={styles.input}
                            value={docenteData.correo}
                            onChangeText={(text) =>
                                setDocenteData((prev) => ({ ...prev, correo: text }))
                            }
                        />
                        <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Guardar cambios</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#1a73e8",
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#fff",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
    scrollContainer: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
    },
    card: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
        width: 100,
        height: 100,
        elevation: 5,
    },
    cardText: {
        marginTop: 6,
        fontSize: 12,
        fontWeight: "600",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000aa",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        width: "75%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    closeModal: {
        color: "#007bff",
        marginBottom: 10,
    },
    modalButton: {
        backgroundColor: "#1a73e8",
        padding: 8,
        borderRadius: 6,
        marginTop: 6,
        width: "100%",
    },
    modalButtonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 14,
    },
    profileImageLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    input: {
        borderBottomWidth: 1,
        width: "100%",
        marginBottom: 10,
        padding: 6,
    },
});

export default NavegadorDocente;
