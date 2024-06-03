import React, {useState} from 'react';
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
import {GoogleAuthProvider, signInWithEmailAndPassword} from 'firebase/auth';
// import {auth} from '../../config';
import {BannerAd, BannerAdSize} from '@react-native-admob/admob';
import {
  GoogleOneTapSignIn,
  statusCodes,
  isErrorWithCode,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
export const Login = ({navigation}) => {
  //Esto es para guardar los datos que el usuario ingrese en el form

  //START
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleUserData = text => {
    setUser(text);
  };
  const handleUserPass = text => {
    setPass(text);
  };
  //END

  //Funciones para loguearse en base a firebase

  const LoginToApp = () => {
    if (
      user !== undefined &&
      user !== '' &&
      pass !== undefined &&
      pass !== ''
    ) {
      try {
        //const auth = getAuth();

        signInWithEmailAndPassword(auth, user, pass)
          .then(() => {
            Alert.alert('Usuario logueado con éxito');
          })
          .catch(err => {
            Alert.alert(err);
          });
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
      }
    } else {
      Alert.alert(
        'Error',
        'El usuario o contraseña no puede estar vacio, Por favor vuelve a intentarlo',
      );
    }
  };

  //Login with google
  GoogleSignin.configure({
    webClientId:
      '58442434849-3p8jjgqd2v873iddjng13dfrpn3kpoaq.apps.googleusercontent.com',
  });

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      const googleCredentials = auth.GoogleAuthProvider.credential(idToken)

      return auth().signInWithCredential(googleCredentials);

    } catch (error) {
      console.log("es el error:"+ error)
      if (error) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // user cancelled the login flow
            break;
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../Assets/fondo.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
      imageStyle={{opacity: 0.08}}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle="dark-content"
        />
        <View style={styles.container}>
          <Image style={{width: 400, height: 400}} source={pollo} />
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
          <TouchableOpacity style={styles.button} onPress={() => LoginToApp()}>
            <Text style={{color: 'white', textAlign: 'center'}}>
              Iniciar Sesión
            </Text>
          </TouchableOpacity>
          <Button
            title="Google Sign-In"
            onPress={() =>
              _signIn()
            }
          />
        </View>
        <BannerAd
          unitId="ca-app-pub-3477493054350988/1457774401"
          size={BannerAdSize.ADAPTIVE_BANNER}
        />
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
