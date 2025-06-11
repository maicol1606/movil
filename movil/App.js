import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//de fault
import Home from './Screen/Home';
import Login from './Screen/Login'; 
import Register from './Screen/Register'; 
import Recuperar from './Screen/Recuperar';
import OlvidarContrasena from './Screen/OlvidarContrasena';
//Admin
import AdminHome from './Screen/Admin/AdminHome';
import NavegacionAdmin from './Screen/Admin/NavegacionAdmin';
import NotificacionesAdmin from './Screen/Admin/NotificacionesAdmin';
import EstudianteNew from './Screen/Admin/EstudianteNew';
import EstudianteList from './Screen/Admin/EstudianteList';
import DocenteList from './Screen/Admin/DocenteList';
import DocenteNew from './Screen/Admin/DocenteNew';
import CampaignNew from './Screen/Admin/CampaignNew';
import CampaignList from './Screen/Admin/CampaignList';
//estudiante
import HomeEstudiante from './Screen/Estudiante/HomeEstudiante';
import NavegadorEstudiante from './Screen/Estudiante/NavegadorEstudiante';
import Horas from './Screen/Estudiante/Horas';
import Certificados from './Screen/Estudiante/Certificados';
//Docente
import HomeDocente from './Screen/Docente/HomeDocente';
import CrearCampaña from './Screen/Docente/CrearCampaña';
import AsignarHoras from './Screen/Docente/AsignarHoras';
import GestionarCampañas from './Screen/Docente/GestionarCampañas';
import NavegadorDocente from './Screen/Docente/NavegadorDocente';
import PostulacionesDocente from './Screen/Docente/PostulacionesDocente';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
<NavigationContainer>
  
  <Stack.Navigator initialRouteName="Home">
    
    {/**de fault */}
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="OlvidarContrasena" component={OlvidarContrasena} />
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="Recuperar" component={Recuperar} />
    {/**admin*/}
    <Stack.Screen name="AdminHome" component={AdminHome} />
    <Stack.Screen name="NavegacionAdmin" component={NavegacionAdmin} />
    <Stack.Screen name="NotificacionesAdmin" component={NotificacionesAdmin} />
    <Stack.Screen name="EstudianteNew" component={EstudianteNew} />
    <Stack.Screen name="EstudianteList" component={EstudianteList} />
    <Stack.Screen name="DocenteList" component={DocenteList} />
    <Stack.Screen name="DocenteNew" component={DocenteNew} />
    <Stack.Screen name="CampaignList" component={CampaignList} />
    <Stack.Screen name="CampaignNew" component={CampaignNew} />
    {/**Estudiante */}
    <Stack.Screen name="HomeEstudiante" component={HomeEstudiante} />
    <Stack.Screen name="NavegadorEstudiante" component={NavegadorEstudiante} />
    <Stack.Screen name="Horas" component={Horas} />
    <Stack.Screen name="Certificados" component={Certificados} />
    {/**Docente */}
    <Stack.Screen name="HomeDocente" component={HomeDocente} />
    <Stack.Screen name="CrearCampaña" component={CrearCampaña} />
    <Stack.Screen name="AsignarHoras" component={AsignarHoras} />
    <Stack.Screen name="GestionarCampañas" component={GestionarCampañas} />
    <Stack.Screen name="NavegadorDocente" component={NavegadorDocente} />
    <Stack.Screen name="PostulacionesDocente" component={PostulacionesDocente} />


    
  </Stack.Navigator>
</NavigationContainer>


  );
}
