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
import order from '../../Assets/order.png';
import coin from '../../Assets/coin-pt.png';
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

export const WinCoins = ({navigation}) => {
  const {adLoaded, adDismissed, show} = useRewardedAd(
    'ca-app-pub-3477493054350988/8242528814',
  );
  const [coins, setCoins] = useState(0);
  const uri =
    'https://firebasestorage.googleapis.com/v0/b/pollotragonapp.appspot.com/o/images%2Fcoin-pt.png?alt=media&token=8aa23bfd-84fc-4aed-a9cd-27129a70e0d8';

  useEffect(() => {
    if (adDismissed) {
      let sum = coins + 1;
      setCoins(sum);
    }
  }, [adDismissed]);

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

            <BannerAd
              unitId="ca-app-pub-3477493054350988/1457774401"
              size={BannerAdSize.ADAPTIVE_BANNER}
            />

            <MenuOptions
              name={'Ruleta Game'}
              url={coin}
              navigation={navigation}
              To={'Roulette'}
            />
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.title}>
                Coins: {coins}{' '}
                <Image style={{width: 25, height: 25}} source={{uri: uri}} />
              </Text>
              <Button
                title="Navigate to next screen"
                onPress={() => {
                  if (adLoaded) {
                    show();
                  } else {
                    //navigation.navigate('Inventory');
                  }
                }}
              />
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
