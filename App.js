import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Login } from './src/screens/Login';
import { HomeScreen } from './src/screens/HomeScreen';
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme, Button,
  Alert
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootNavigation } from './src/navigation';
import { MenuProvider } from './src/hooks/MenuContext';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-admob/admob';
const Stack = createNativeStackNavigator();

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <MenuProvider>
      <RootNavigation />
      <BannerAd unitId={TestIds.BANNER} size={BannerAdSize.FULL_BANNER}/>
      <BannerAd unitId='ca-app-pub-3477493054350988/1457774401' size={BannerAdSize.FULL_BANNER}/>
    </MenuProvider>

  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, 
    width: '100%', 
    height: '100%', 
  },
  container: {
    flex: 1, 
  },
});
