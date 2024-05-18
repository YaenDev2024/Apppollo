import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Login} from './src/screens/Login';
import {HomeScreen} from './src/screens/HomeScreen';
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,Button,
  Alert
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootNavigation} from './src/navigation';
// Mueve la declaración de Stack fuera de la función App
const Stack = createNativeStackNavigator();

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // function create ()
  // {
  //   setDoc(doc(db, "food", "LA"), {
  //     name: "Los Angeles",
  //     state: "CA",
  //     country: "USA"
  //   }).then(()=>{
  //     console.log("siuu")
  //   }).catch((err)=>{
  //     console.log(err)
  //   });
  // }

  return (
      <RootNavigation/>

  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // Asegura que la imagen ocupe todo el espacio disponible
    width: '100%', // Ancho igual al 100% del contenedor
    height: '100%', // Alto igual al 100% del contenedor
  },
  container: {
    flex: 1, // Asegura que los componentes dentro del contenedor se expandan correctamente
    // Otros estilos según sea necesario para tu diseño
  },
});
