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
    const [campanas, setCampanas] = useState<any[]>([]);
    const [postulaciones, setPostulaciones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
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
                let campanasResponse;
                try {
                    campanasResponse = await axios.get("http://192.168.1.18:3000/api/campanas/mostrarCampanas");
                } catch (error) {
                    console.log("Primer endpoint falló, intentando alternativo...");
                    campanasResponse = await axios.get("http://192.168.1.18:3000/api/campanas");
                }

                if (campanasResponse.data && campanasResponse.data.success && Array.isArray(campanasResponse.data.data)) {
                    setCampanas(campanasResponse.data.data);
                } else if (Array.isArray(campanasResponse.data)) {
                    setCampanas(campanasResponse.data);
                } else if (campanasResponse.data && Array.isArray(campanasResponse.data.campanas)) {
                    setCampanas(campanasResponse.data.campanas);
                } else {
                    console.log("La respuesta no tiene el formato esperado:", campanasResponse.data);
                    setCampanas([]);
                }

                try {
                    const postulacionesResponse = await axios.get("http://192.168.1.18:3000/api/postulacion");
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
            if (isNaN(f.getTime())) return "Fecha no válida";
            return `${f.getDate().toString().padStart(2, "0")}/${(f.getMonth() + 1).toString().padStart(2, "0")}/${f.getFullYear()}`;
        } catch (error) {
            return "Fecha no válida";
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <ImageBackground
                    style={styles.headerImage}
                    imageStyle={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
                >
                    <View style={styles.headerOverlay}>
                        <Text style={styles.headerTitle}>Bienvenido al Servicio Social</Text>
                    </View>
                </ImageBackground>

                <View style={styles.introSection}>
                    <Text style={styles.introTitle}>¿Listo para iniciar tu servicio social?</Text>
                    <Text style={styles.introSubtitle}>¡Todo estudiante debe hacerlo!</Text>
                    <Text style={styles.introText}>
                        El servicio social permite al estudiante en formación retribuir a la sociedad, contribuyendo con propuestas de solución y conocimientos hacia sectores desfavorecidos.
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
                        <Text style={styles.buttonText}>Ver</Text>
                    </TouchableOpacity>
                </View>

                <Modal transparent visible={showModal} animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>¿Por qué postularse?</Text>
                            <Text style={styles.modalText}>
                                Completar las <Text style={{ fontWeight: "bold" }}>120 horas</Text> de servicio social es obligatorio y te brinda la oportunidad de contribuir a tu comunidad mientras desarrollas habilidades clave.
                            </Text>
                            <TouchableOpacity style={styles.button} onPress={() => setShowModal(false)}>
                                <Text style={styles.buttonText}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <View style={styles.campaignsContainer}>
                    <Text style={styles.sectionTitle}>Campañas disponibles</Text>
                    {loading ? (
                        <Text style={styles.loadingText}>Cargando campañas...</Text>
                    ) : campanas.length === 0 ? (
                        <Text style={styles.noCampaignsText}>No hay campañas disponibles</Text>
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.campaignScroll}>
                            {campanas.map((campana, index) => {
                                const postulados = postulaciones.filter(
                                    (p) => p && p.campana_id === (campana.id_campana || campana.id)
                                ).length;

                                return (
                                    <View key={campana.id_campana || campana.id || index} style={styles.campaignItem}>
                                        {campana.imagen && (
                                            <Image
                                                source={{ uri: `http://192.168.1.18:8081/img/campanas/${campana.imagen}` }}
                                                style={styles.campaignImage}
                                                resizeMode="cover"
                                            />
                                        )}
                                        <Text style={styles.campaignName}>{campana.nom_campana || campana.nombre || "Sin nombre"}</Text>
                                        <Text>{campana.descripcion || "Sin descripción"}</Text>
                                        <Text>Cupos: {campana.cupos || "No especificado"}</Text>
                                        <Text>Postulados: {postulados}</Text>
                                        <Text>Inicio: {formatearFecha(campana.fecha)}</Text>
                                        <TouchableOpacity style={styles.postulateButton} onPress={() => navigation.navigate("Login")}>
                                            <Text style={styles.postulateText}>Postúlate</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    )}
                </View>

                {Platform.OS !== 'web' && (
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

            <View style={styles.bottomMenu}>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Login")}>
                    <Icon name="sign-in-alt" size={24} color="#104F92FF" />
                    <Text style={styles.menuText}>Iniciar Sesión</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Register")}>
                    <Icon name="user-plus" size={24} color="#15299CFF" />
                    <Text style={styles.menuText}>Registrarse</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9fafc" },
    headerImage: { height: 180, justifyContent: "center" },
    headerOverlay: { backgroundColor: "rgba(0, 0, 0, 0.4)", paddingVertical: 20, alignItems: "center" },
    headerTitle: { fontSize: 22, color: "#fff", fontWeight: "bold" },
    introSection: { padding: 15 },
    introTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
    introSubtitle: { fontSize: 16, marginBottom: 10 },
    introText: { fontSize: 14, marginBottom: 10 },
    button: { backgroundColor: "#104F92", padding: 10, borderRadius: 10, alignItems: "center" },
    buttonText: { color: "white", fontWeight: "bold" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
    modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" },
    modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    modalText: { fontSize: 14, marginBottom: 15 },
    campaignsContainer: { padding: 15 },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    loadingText: { fontStyle: "italic" },
    noCampaignsText: { fontStyle: "italic", color: "#999" },
    campaignScroll: { flexDirection: "row" },
    campaignItem: { width: 220, marginRight: 10, backgroundColor: "#fff", padding: 10, borderRadius: 10 },
    campaignImage: { width: "100%", height: 100, borderRadius: 10, marginBottom: 10 },
    campaignName: { fontWeight: "bold", fontSize: 16 },
    postulateButton: { marginTop: 10, backgroundColor: "#15299C", padding: 8, borderRadius: 6, alignItems: "center" },
    postulateText: { color: "white", fontWeight: "bold" },
    mapContainer: { padding: 15, height: 300 },
    map: { flex: 1 },
    bottomMenu: { flexDirection: "row", justifyContent: "space-around", padding: 10, borderTopWidth: 1, borderColor: "#ddd" },
    menuItem: { alignItems: "center" },
    menuText: { fontSize: 12, marginTop: 5 },
});

export default Home;
