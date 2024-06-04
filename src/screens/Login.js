import React, { useState, useEffect } from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Alert,
} from 'react-native';
import pollo from '../../Assets/fnbg.png';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { BannerAd, BannerAdSize } from '@react-native-admob/admob';
import { auth } from '../../config';


export const Login = ({ navigation }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '58442434849-5ejnse52ethv4v25u7nm0la5dri7h8k1.apps.googleusercontent.com',
    });
  }, []);

  const handleUserData = (text) => {
    setUser(text);
  };

  const handleUserPass = (text) => {
    setPass(text);
  };

  const LoginToApp = () => {
    if (user && pass) {
      signInWithEmailAndPassword(auth, user, pass)
        .then(() => {
          Alert.alert('Usuario logueado con éxito');
        })
        .catch((err) => {
          Alert.alert(err.message);
        });
    } else {
      Alert.alert(
        'Error',
        'El usuario o contraseña no puede estar vacio, Por favor vuelve a intentarlo'
      );
    }
  };

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      console.log(userCredential);
      return userCredential;
    } catch (error) {
      console.error('Error en Sign In: ', error);
      throw error;
    }
  }

  const handleSignIn = async () => {
    try {
      await onGoogleButtonPress();
      const signedInUser = auth.currentUser;
      console.log('User Signed In: ', signedInUser?.displayName);
    } catch (error) {
      console.log('Error en Sign In: ', error);
    }
  };

  return (
    <ImageBackground
      source={require('../../Assets/fondo.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
      imageStyle={{ opacity: 0.08 }}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <StatusBar translucent backgroundColor={'transparent'} barStyle="dark-content" />
        <View style={styles.container}>
          <Image style={{ width: 400, height: 400 }} source={pollo} />
          <Text style={styles.textUsers}>Usuario: </Text>
          <TextInput
            style={styles.inputType}
            placeholderTextColor={'gray'}
            placeholder="Usuario"
            onChangeText={handleUserData}
          />
          <Text style={styles.textUsers}>Contraseña: </Text>
          <TextInput
            style={styles.inputType}
            placeholderTextColor={'gray'}
            secureTextEntry={true}
            placeholder="Ingrese su Contraseña"
            onChangeText={handleUserPass}
          />
          <TouchableOpacity style={styles.button} onPress={LoginToApp}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <GoogleSigninButton onPress={handleSignIn} disabled={false} />
        </View>
        <BannerAd unitId="ca-app-pub-3477493054350988/1457774401" size={BannerAdSize.ADAPTIVE_BANNER} />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  inputType: {
    color: 'black',
    borderColor: 'gray',
    borderWidth: 0.5,
    width: '75%',
    margin: 10,
    borderRadius: 20,
    textAlign: 'center',
  },
  textUsers: {
    color: 'black',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    width: 150,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
