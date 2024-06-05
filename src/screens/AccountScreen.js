import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  View,
  Switch,
} from 'react-native';
import {StyleSheet, Text} from 'react-native';
import {NavBar} from '../components/NavBar';
import {ScrollView} from 'react-native';
import {BannerAd, BannerAdSize} from '@react-native-admob/admob';
import {auth} from '../../config';
import Icons from '../components/Icons';

const AccountScreen = () => {
  const [time, setTime] = useState(true);
  const signedUser = auth.currentUser;
  const getHighResImageUrl = url => {
    // Ajusta el tamaño de la imagen de perfil de Google a una mayor resolución
    return url ? url.replace('s96-c', 's400-c') : null;
  };
  useEffect(() => {
    setTimeout(() => {
      setTime(false);
    }, 1000);
  }, [time]);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={'transparent'} barStyle="light-content" />
      <NavBar name={'Cuenta personal'} />
      {time ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.profileContainer}>
            <ImageBackground
              source={{ uri: getHighResImageUrl(signedUser.photoURL) }}
              style={styles.profileImage}
              resizeMode="cover">
              <View style={styles.overlay}>
                <Text style={styles.nameText}>{signedUser.displayName}</Text>
                <Text style={styles.emailText}>{signedUser.email}</Text>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.menuContainerMain}>
            <View style={styles.containerEconomy}>
              <Icons name={'wallet'} sizes={25} />
              <Text style={styles.menuItemTextWallet}>Cartera</Text>
            </View>

            <View style={styles.menuItem}>
              <Text style={styles.menuItemText}>Metodo de Pago:</Text>
              <Icons name={'cc-paypal'} sizes={30} />
            </View>
            <View style={styles.menuItem}>
              <Icons name={'money'} sizes={20} />

              <Text style={styles.menuItemText}>Saldo Total de Monedas</Text>
              <Text style={styles.menuItemText}>1234</Text>
            </View>
            {/* <View style={styles.menuItem}>
              <Text style={styles.menuItemText}>Privacy</Text>
              <View style={styles.radioGroup}>
                <Text style={styles.radioText}>Private</Text>
                <Switch />
                <Text style={styles.radioText}>Public</Text>
                <Switch />
              </View>
            </View> */}
          </View>
          <View style={styles.menuContainer}>
            <View style={styles.menuSecondItem}>
              <Icons name={'feedback'} sizes={25} />
              <Text style={styles.menuSecondItemText}>Feedback</Text>
            </View>
            <View style={styles.menuSecondItem}>
              <Icons name={'file-contract'} sizes={25} />

              <Text style={styles.menuSecondItemText}>
                Terms and Conditions
              </Text>
            </View>
            <View style={styles.menuSecondItem}>
              <Icons name={'hide-source'} sizes={25} />

              <Text style={styles.menuSecondItemText}>Deactivate</Text>
            </View>
            <View style={styles.menuSecondItem}>
              <Icons name={'logoutt'} sizes={25} />

              <Text style={styles.menuSecondItemText}>Logout</Text>
            </View>
          </View>
          <BannerAd
            unitId="ca-app-pub-3477493054350988/1457774401"
            size={BannerAdSize.ADAPTIVE_BANNER}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  profileContainer: {
    width: '100%',
    height: 300, // Ajusta según sea necesario
    marginBottom: 20,
  },
  profileImage: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  overlay: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    alignItems: 'flex-start',
  },
  nameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  emailText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    marginBottom: 10,
  },
  menuContainer: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginBottom: 0,
    elevation: 2, // Añade sombra en Android
    shadowColor: '#000', // Añade sombra en iOS
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuContainerMain: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginBottom: 20,
    marginTop: -20,
    elevation: 2, // Añade sombra en Android
    shadowColor: '#000', // Añade sombra en iOS
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.01,
    shadowRadius: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingLeft: 55,
  },
  menuSecondItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: 'black',
    paddingBottom: 0,
  },
  menuSecondItemText: {
    fontSize: 16,
    color: 'black',
    paddingLeft: 20,
  },
  menuItemTextWallet: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    marginRight: 10,
    fontSize: 16,
    color: 'black',
  },
  containerEconomy: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
});

export default AccountScreen;
