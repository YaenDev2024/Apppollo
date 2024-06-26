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
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth, db} from '../../config';
import {BannerAd, BannerAdSize} from '@react-native-admob/admob';
import { addDoc, collection } from 'firebase/firestore';

export const Register = ({navigation}) => {
  //Esto es para guardar los datos que el usuario ingrese en el form

  //START
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [mail, setMail] = useState('');
  const handleUserData = text => {
    setUser(text);
  };
  const handleUserPass = text => {
    setPass(text);
  };
  const handleCorreoData = text => {
    setMail(text);
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
        createUserWithEmailAndPassword(auth, mail, pass)
          .then(async () => {
            Alert.alert('Usuario registrado con éxito');

            try {
              const docRef = await addDoc(collection(db, 'users'), {
                userid: user,
                mail: mail,
                pass: pass,
                coins: 0
              });
              console.log('Document written with ID: ', docRef.id);
            } catch (err) {
              console.error('Error adding document: ', err);
            }
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
          <Text style={styles.textUsers}>Correo: </Text>
          <TextInput
            style={styles.inputType}
            placeholderTextColor={'gray'}
            placeholder="Correo"
            onChangeText={handleCorreoData}
          />
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
            <Text style={{color: 'white', textAlign: 'center'}}>Register</Text>
          </TouchableOpacity>
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
