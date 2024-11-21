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
  useColorScheme,
  Button,
  Alert
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootNavigation } from './src/navigation';
import { MenuProvider } from './src/hooks/MenuContext';
import { BannerAd, BannerAdSize, TestIds, AppOpenAdProvider } from '@react-native-admob/admob';
import { StripeProvider } from '@stripe/stripe-react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <StripeProvider publishableKey="tu-clave-publica">
    <AppOpenAdProvider
      unitId={'pk_live_Zh9ba81b0ftAyBc8uQqxi110'} 
      options={{
        showOnColdStart: true,
        showOnAppForeground: true,
        loadOnDismissed:true
      }}
    >
      <MenuProvider>
        <NavigationContainer>
          <RootNavigation />
        </NavigationContainer>
      </MenuProvider>
    </AppOpenAdProvider>
    </StripeProvider>
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
