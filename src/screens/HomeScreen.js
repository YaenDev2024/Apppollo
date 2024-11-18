import React, {useEffect, useState} from 'react';
import {
  View,
  ImageBackground,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {MenuOptions} from '../components/MenuOptions';
import inventory from '../../Assets/inventory-removebg-preview.png';
import buy from '../../Assets/cmcarritos.png';
import {NavBar} from '../components/NavBar';
import order from '../../Assets/order.png';
import coin from '../../Assets/coin-pt.png';
import {BannerAd, useRewardedAd, BannerAdSize} from '@react-native-admob/admob';
import {auth, db} from '../../config';
import {collection, query, where, onSnapshot} from 'firebase/firestore';
import UsuarioNormal from './ByRoles/UsuarioNormal';

export const HomeScreen = ({navigation}) => {
  const {adLoaded, adDismissed, show} = useRewardedAd(
    'ca-app-pub-3477493054350988/8242528814',
  );
  const signedInUser = auth.currentUser;
  const [time, setTime] = useState(true);
  const [role, setRole] = useState('');
  const [itApprovedBanner, setitApprovedBanner] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTime(false);
    }, 1000);
  }, [time]);

  useEffect(() => {
    if (signedInUser) {
      const fetchData = async () => {
        try {
          const q = query(
            collection(db, 'users'),
            where('mail', '==', signedInUser.email),
          );
          const qbanner = query(
            collection(db, 'ads'),
            where('mail', '==', signedInUser.email),
          );
          const unsubscribeAds = onSnapshot(qbanner, querySnapshot => {
            querySnapshot.forEach(doc => {
              if (doc.exists) {
                setitApprovedBanner(doc.data().PlusBanner);
              }
            });
          });
          const unsubscribe = onSnapshot(q, querySnapshot => {
            querySnapshot.forEach(doc => {
              if (doc.exists) {
                setRole(doc.data().role);
              }
            });
          });
          return () => {
            unsubscribe();
            unsubscribeAds();
          };
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
      };

      fetchData();
    }
  }, [signedInUser]);

  const renderMenuOptions = () => {
    if (role === 'admin') {
      return (
        <>
          <MenuOptions
            name={'Inventario'}
            url={inventory}
            navigation={navigation}
            To={'Inventory'}
            desc={'Programa de recompensas'}
          />
          <MenuOptions
            name={'Compras'}
            url={buy}
            navigation={navigation}
            To={'Buy'}
            desc={'Programa de recompensas'}
          />
          <MenuOptions
            name={'Ordenes'}
            url={order}
            navigation={navigation}
            To={'Orders'}
            desc={'Programa de recompensas'}
          />
          <MenuOptions
            name={'Recompensas'}
            url={coin}
            navigation={navigation}
            To={'Win'}
            desc={'Programa de recompensas'}
          />
        </>
      );
    } else if (role === 'user') {
      return (
        <>
          <MenuOptions
            name={'Gana PTCoins'}
            url={coin}
            navigation={navigation}
            To={'Win'}
            desc={'Programa de recompensas'}
          />
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.root}>
      {role === 'admin' ? (
        <UsuarioNormal />
      ) : (
        <ImageBackground
          source={require('../../Assets/fondo.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
          imageStyle={{opacity: 0.08}}>
          <StatusBar backgroundColor={'transparent'} barStyle="light-content" />
          <NavBar name={'Menu'} />
          {time ? (
            <ActivityIndicator size="large" color="black" />
          ) : (
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.container}>
                {itApprovedBanner ? (
                  <BannerAd
                    unitId="ca-app-pub-3477493054350988/1457774401"
                    size={BannerAdSize.ADAPTIVE_BANNER}
                  />
                ) : null}
                <View style={styles.menuContainer}>{renderMenuOptions()}</View>
                <View style={styles.buttonContainer}></View>
              </View>
              <BannerAd
                unitId="ca-app-pub-3477493054350988/1457774401"
                size={BannerAdSize.ADAPTIVE_BANNER}
              />
            </ScrollView>
          )}
        </ImageBackground>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
