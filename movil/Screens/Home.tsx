import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Image,
    ImageBackground,
    Platform,
} from "react-native";

import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/FontAwesome5";
import { RootStackParamList } from "../navigation/PublicNavigate";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MapView, { Marker } from "react-native-maps";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [campanas, setCampanas] = useState<any[]>([]); // Inicializado como array vacío
    const [postulaciones, setPostulaciones] = useState<any[]>([]); // Inicializado como array vacío
    const [loading, setLoading] = useState(true); // Estado de carga
    const navigation = useNavigation<HomeScreenNavigationProp>();

    useEffect(() => {
        const checkIfAlertShown = async () => {
            try {
                const value = await AsyncStorage.getItem("hasSeenAlert");
                if (value === null) {
                    setShowModal(true);
                    await AsyncStorage.setItem("hasSeenAlert", "true");
                }
            } catch (error) {
                console.log("Error verificando AsyncStorage:", error);
            }
        };

        checkIfAlertShown();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Intentar primera URL
                let campanasResponse;
                try {
                    campanasResponse = await axios.get(
                        "http://192.168.1.18:3000/api/campanas/mostrarCampanas"
                    );
                } catch (error) {
                    console.log("Primer endpoint falló, intentando alternativo...");
                    // Si falla, intentar URL alternativa
                    campanasResponse = await axios.get(
                        "http://192.168.1.18:3000/api/campanas"
                    );
                }

                console.log("Respuesta de campañas:", campanasResponse.data);
                
                // CORRECCIÓN: Verificar la estructura correcta de la respuesta
                if (campanasResponse.data && campanasResponse.data.success && Array.isArray(campanasResponse.data.data)) {
                    // La respuesta tiene la estructura: { data: [...], message: "", success: true }
                    setCampanas(campanasResponse.data.data);
                    console.log("Campañas cargadas:", campanasResponse.data.data.length);
                } else if (Array.isArray(campanasResponse.data)) {
                    // Si la respuesta es directamente un array
                    setCampanas(campanasResponse.data);
                } else if (campanasResponse.data && Array.isArray(campanasResponse.data.campanas)) {
                    // Si viene en un objeto con propiedad campanas
                    setCampanas(campanasResponse.data.campanas);
                } else {
                    console.log("La respuesta no tiene el formato esperado:", campanasResponse.data);
                    setCampanas([]);
                }

                // Intentar cargar postulaciones
                try {
                    const postulacionesResponse = await axios.get(
                        "http://192.168.1.18:3000/api/postulacion"
                    );
                    console.log("Respuesta de postulaciones:", postulacionesResponse.data);
                    
                    // Aplicar la misma lógica para postulaciones
                    if (postulacionesResponse.data && postulacionesResponse.data.success && Array.isArray(postulacionesResponse.data.data)) {
                        setPostulaciones(postulacionesResponse.data.data);
                    } else if (Array.isArray(postulacionesResponse.data)) {
                        setPostulaciones(postulacionesResponse.data);
                    } else {
                        console.log("Postulaciones no disponibles o formato incorrecto");
                        setPostulaciones([]);
                    }
                } catch (postError) {
                    console.log("Error cargando postulaciones:", postError);
                    // Verificar si es un error 404 (endpoint no existe)
                    if (postError.response && postError.response.status === 404) {
                        console.log("Endpoint de postulaciones no encontrado (404)");
                    }
                    setPostulaciones([]);
                }

            } catch (error) {
                console.error("Error al cargar datos:", error);
                setCampanas([]);
                setPostulaciones([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatearFecha = (fecha: string) => {
        try {
            const f = new Date(fecha);
            if (isNaN(f.getTime())) {
                return "Fecha no válida";
            }
            return `${f.getDate().toString().padStart(2, "0")}/${(f.getMonth() + 1)
                .toString()
                .padStart(2, "0")}/${f.getFullYear()}`;
        } catch (error) {
            return "Fecha no válida";
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Encabezado */}
                <ImageBackground
                    style={styles.headerImage}
                    imageStyle={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
                >
                    <View style={styles.headerOverlay}>
                        <Text style={styles.headerTitle}>Bienvenido al Servicio Social</Text>
                    </View>
                </ImageBackground>

                {/* Introducción */}
                <View style={styles.introSection}>
                    <Text style={styles.introTitle}>¿Listo para iniciar tu servicio social?</Text>
                    <Text style={styles.introSubtitle}>¡Todo estudiante debe hacerlo!</Text>
                    <Text style={styles.introText}>
                        El servicio social constituye una actividad que permite al estudiante en
                        formación retribuir a la sociedad, contribuyendo con propuestas de solución
                        y aplicación de conocimientos integrales hacia los sectores más
                        desfavorecidos.
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
                        <Text style={styles.buttonText}>Ver</Text>
                    </TouchableOpacity>
                </View>

                {/* Modal de bienvenida */}
                <Modal transparent visible={showModal} animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>¿Por qué postularse?</Text>
                            <Text style={styles.modalText}>
                                Completar las <Text style={{ fontWeight: "bold" }}>120 horas</Text>{" "}
                                de servicio social es obligatorio y te brinda la oportunidad de
                                contribuir al bienestar de tu comunidad mientras desarrollas
                                habilidades clave para tu formación.
                            </Text>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => setShowModal(false)}
                            >
                                <Text style={styles.buttonText}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Lista de campañas */}
                <View style={styles.campaignsContainer}>
                    <Text style={styles.sectionTitle}>Campañas disponibles</Text>
                    
                    {loading ? (
                        <Text style={styles.loadingText}>Cargando campañas...</Text>
                    ) : campanas.length === 0 ? (
                        <Text style={styles.noCampaignsText}>No hay campañas disponibles</Text>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.campaignScroll}
                        >
                            {campanas.map((campana, index) => {
                                // Verificación segura para evitar errores
                                // CORRECCIÓN: Usar id_campaña en lugar de id para el filtro
                                const postulados = postulaciones.filter(
                                    (p) => p && p.campana_id === (campana.id_campaña || campana.id)
                                ).length;

                                return (
                                    <View key={campana.id_campaña || campana.id || index} style={styles.campaignItem}>
                                        {campana.imagen && (
                                            <Image
                                                source={{
                                                    uri: `http://192.168.1.18:8081/img/campanas/${campana.imagen}`
                                                }}
                                                style={styles.campaignImage}
                                                onError={(error) => console.error("Error al cargar la imagen:", error)}
                                                onLoad={() =>
                                                    console.log("Imagen cargada correctamente")
                                                }
                                                resizeMode="cover"
                                            />
                                        )}
                                        <Text style={styles.campaignName}>
                                            {campana.nom_campaña || campana.nombre || "Sin nombre"}
                                        </Text>
                                        <Text>{campana.descripcion || "Sin descripción"}</Text>
                                        <Text>Cupos: {campana.cupos || "No especificado"}</Text>
                                        <Text>Postulados: {postulados}</Text>
                                        <Text>Inicio: {formatearFecha(campana.fecha)}</Text>
                                        <TouchableOpacity
                                            style={styles.postulateButton}
                                            onPress={() => navigation.navigate("Login")}
                                        >
                                            <Text style={styles.postulateText}>Postúlate</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    )}
                </View>

                {/* Maps - Condición para no cargar el mapa en la web */}
                {Platform.OS === 'web' ? (
                    <View style={styles.mapContainer}>
                        <Text style={styles.sectionTitle}>Ubicación de referencia</Text>
                        <Text>Mapa no disponible en la web</Text>
                    </View>
                ) : (
                    <View style={styles.mapContainer}>
                        <Text style={styles.sectionTitle}>Ubicación de referencia</Text>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: 4.486698,
                                longitude: -74.10854,
                                latitudeDelta: 0.055,
                                longitudeDelta: 0.055,
                            }}
                        >
                            <Marker
                                coordinate={{ latitude: 4.486698, longitude: -74.10854 }}
                                title="Colegio Fernando González Ochoa"
                                description="Carrera 4D Este #89-55 Sur, Chicó Sur, Usme"
                            />
                        </MapView>
                    </View>
                )}

            </ScrollView>

            {/* Menú inferior */}
            <View style={styles.bottomMenu}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Icon name="sign-in-alt" size={24} color="#104F92FF" />
                    <Text style={styles.menuText}>Iniciar Sesión</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate("Register")}
                >
                    <Icon name="user-plus" size={24} color="#15299CFF" />
                    <Text style={styles.menuText}>Registrarse</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafc",
    },
    headerImage: {
        height: 180,
        justifyContent: "center",
    },
    headerOverlay: {
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 22,
        color: "#fff",
        fontWeight: "bold",
    },
    introSection: {
        backgroundColor: "#ffffff",
        padding: 20,
        marginTop: -15,
    },
    introTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0077cc",
        marginBottom: 5,
    },
    introSubtitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
    },
    introText: {
        fontSize: 14,
        textAlign: "justify",
        color: "#444",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#0077cc",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignSelf: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 25,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalText: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
    },
    campaignsContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
    campaignScroll: {
        marginBottom: 20,
    },
    campaignItem: {
        width: 250,
        marginRight: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    campaignImage: {
        width: "100%",
        height: 120,
        borderRadius: 10,
    },
    campaignName: {
        fontWeight: "bold",
        marginTop: 10,
        fontSize: 16,
    },
    postulateButton: {
        backgroundColor: "#104F92FF",
        marginTop: 15,
        paddingVertical: 5,
        borderRadius: 5,
        alignItems: "center",
    },
    postulateText: {
        color: "#fff",
        fontWeight: "bold",
    },
    loadingText: {
        textAlign: "center",
        fontSize: 16,
        color: "#666",
        marginVertical: 20,
    },
    noCampaignsText: {
        textAlign: "center",
        fontSize: 16,
        color: "#999",
        marginVertical: 20,
    },
    mapContainer: {
        padding: 20,
        backgroundColor: "#fff",
    },
    map: {
        height: 250,
        borderRadius: 10,
    },
    bottomMenu: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#fff",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    menuItem: {
        alignItems: "center",
    },
    menuText: {
        fontSize: 12,
        color: "#333",
    },
});

export default Home;