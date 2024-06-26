import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  Button,
  Alert,
  Image,
} from 'react-native';
import Icons from '../components/Icons';
import {MenuOptions} from '../components/MenuOptions';
import inventory from '../../Assets/inventory-removebg-preview.png';
import buy from '../../Assets/cmcarritos.png';
import {NavBar} from '../components/NavBar';
import quiz from '../../Assets/quiz.png';
import coin from '../../Assets/ruleta.png';
import {
  BannerAd,
  RewardedAd,
  RewardedInterstitialAd,
  InterstitialAd,
  BannerAdSize,
  TestIds,
  useRewardedInterstitialAd,
  useInterstitialAd,
  useRewardedAd,
  useAppOpenAd,
} from '@react-native-admob/admob';
import {collection, onSnapshot, query, where} from 'firebase/firestore';
import {auth, db} from '../../config';

export const WinCoins = ({navigation}) => {
  const {adLoaded, adDismissed, show} = useRewardedAd(
    'ca-app-pub-3477493054350988/8242528814',
  );
  const signedInUser = auth.currentUser;
  const [itApprovedBanner, setitApprovedBanner] = useState(true);

  const uri =
    'https://firebasestorage.googleapis.com/v0/b/pollotragonapp.appspot.com/o/images%2Fcoin-pt.png?alt=media&token=8aa23bfd-84fc-4aed-a9cd-27129a70e0d8';

  useEffect(() => {
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
    return () => unsubscribeAds();
  }, []);

  return (
    <View style={{backgroundColor: 'white', width: '100%', height: '100%'}}>
      <ImageBackground
        source={require('../../Assets/fondo.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={{opacity: 0.08}}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <StatusBar
            backgroundColor={'transparent'}
            barStyle="light-contentz"
          />
          <View style={styles.container}>
            <NavBar name={'Win'} />

            {itApprovedBanner ? (
              <BannerAd
                unitId="ca-app-pub-3477493054350988/1457774401"
                size={BannerAdSize.ADAPTIVE_BANNER}
              />
            ) : null}

            <MenuOptions
              name={'Juego de Ruleta'}
              url={coin}
              navigation={navigation}
              To={'Roulette'}
              desc={'Juego de ruleta con el Pollito Tommy'}
            />

            <MenuOptions
              name={'Juego de Preguntas'}
              url={quiz}
              navigation={navigation}
              To={'Quiz'}
              desc={'Responde las preguntas del Pollito Tommy '}
            />
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              {/* <Text style={styles.title}>
                Coins: {coins}{' '}
                <Image style={{width: 25, height: 25}} source={{uri: uri}} />
              </Text> */}
            </View>
          </View>

          <BannerAd
            unitId="ca-app-pub-3477493054350988/1457774401"
            size={BannerAdSize.ADAPTIVE_BANNER}
          />
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'start',
  },
  navbar: {
    backgroundColor: 'white',
    width: '100%',
    height: '7%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    marginLeft: 20,
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
  },
});
