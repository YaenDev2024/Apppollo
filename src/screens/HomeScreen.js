import React, { useEffect } from 'react';
import {
  View,
  ImageBackground,
  ScrollView,
  StyleSheet,
  StatusBar,
  Button,
} from 'react-native';
import { MenuOptions } from '../components/MenuOptions';
import inventory from '../../Assets/inventory-removebg-preview.png';
import buy from '../../Assets/cmcarritos.png';
import { NavBar } from '../components/NavBar';
import order from '../../Assets/order.png';
import coin from '../../Assets/coin-pt.png';
import {
  BannerAd,
  useRewardedAd,
  BannerAdSize,
} from '@react-native-admob/admob';

export const HomeScreen = ({ navigation }) => {
  const { adLoaded, adDismissed, show } = useRewardedAd(
    'ca-app-pub-3477493054350988/8242528814'
  );

  useEffect(() => {
    if (adDismissed) {
      navigation.navigate('Inventory');
    }
  }, [adDismissed, navigation]);

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../../Assets/fondo.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={{ opacity: 0.08 }}
      >
        <StatusBar backgroundColor={'transparent'} barStyle="light-content" />
        <NavBar name={'Menu'} />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <BannerAd
              unitId="ca-app-pub-3477493054350988/1457774401"
              size={BannerAdSize.FULL_BANNER}
            />
            <View style={styles.menuContainer}>
              <MenuOptions name={'Inventario'} url={inventory} navigation={navigation} To={'Inventory'} />
              <MenuOptions name={'Compras'} url={buy} navigation={navigation} To={'Buy'} />
              <MenuOptions name={'Ordenes'} url={order} navigation={navigation} To={'Orders'} />
              <MenuOptions name={'Win PTCoins'} url={coin} navigation={navigation} To={'Win'} />
              <MenuOptions name={'Tickets'} url={coin} navigation={navigation} To={'Ticket'} />
              <MenuOptions name={'Share'} url={coin} navigation={navigation} To={'Share'} />
              <MenuOptions name={'PDF'} url={coin} navigation={navigation} To={'pdf'} />
            </View>
            <View style={styles.buttonContainer}>
              {/* <Button
                title="Navigate to next screen"
                onPress={() => {
                  if (adLoaded) {
                    show();
                  }
                }}
              /> */}
            </View>
            <BannerAd
              unitId="ca-app-pub-3477493054350988/1457774401"
              size={BannerAdSize.FULL_BANNER}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  menuContainer: {
    width: '100%',
    marginVertical: 20,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  navbar: {
    width: '100%',
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    elevation: 4, // Añade sombra en Android
    shadowColor: '#000', // Añade sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;