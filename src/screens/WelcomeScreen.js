import React from 'react';
import {Image, ImageBackground, StatusBar, TouchableOpacity,StyleSheet, Text,TextInput,View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import pollo from '../../Assets/fnbg.png';
import { BannerAd, BannerAdSize } from '@react-native-admob/admob';
export const WelcomeScreen = ({navigation}) => {


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
        <TouchableOpacity style={styles.button}  onPress={() => navigation.navigate('Sign Up')}>
          <Text style={{color: 'white', textAlign: 'center'}}>
            Registrarse
          </Text>
        </TouchableOpacity>
        <Text>o</Text>
        <TouchableOpacity style={styles.button}  onPress={() => navigation.navigate('Sign In')}>
          <Text style={{color: 'white', textAlign: 'center'}}>
            Iniciar Sesion
          </Text>
        </TouchableOpacity>
      </View>
      <BannerAd unitId='ca-app-pub-3477493054350988/1457774401' size={BannerAdSize.FULL_BANNER}/>

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
