import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ImageBackground,
  ScrollView,
  View,
  Alert,
  Text,
  Image,
  Vibration,
} from 'react-native';
import {NavBar} from '../../components/NavBar';
import {
  BannerAd,
  BannerAdSize,
  useRewardedAd,
  useInterstitialAd,
  useRewardedInterstitialAd,
} from '@react-native-admob/admob';
import {useAuth} from '../../hooks/useAuth';

const RuletaGame = () => {
  const [rotation] = useState(new Animated.Value(0));
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [coinAnimation] = useState(new Animated.Value(0));
  const [textAnimation] = useState(new Animated.Value(0));
  const handleVibration = () => {
    Vibration.vibrate();
  };
  const {
    adLoaded: interstitialLoaded,
    adDismissed: interstitialDismissed,
    show: showInterstitial,
  } = useInterstitialAd('ca-app-pub-3477493054350988/8755348914');
  const {
    adLoaded: rewardedLoaded,
    adDismissed: rewardedDismissed,
    show: showRewarded,
  } = useRewardedAd(
    'ca-app-pub-3477493054350988/8242528814', // Cambiar a tu ID de anuncio recompensado
  );

  const {
    adLoaded: rewardedInterstitialLoaded,
    adDismissed: rewardedIntertitialDismissed,
    show: showRewardedInterstitial,
  } = useRewardedInterstitialAd(
    'ca-app-pub-3477493054350988/3027142417', // Cambiar a tu ID de anuncio intersticial recompensado
  );

  const {user} = useAuth();

  const flipCoin = () => {
    const randomValue = Math.random();
    const rotateDuration = 1000;

    rotation.setValue(0);

    Animated.timing(rotation, {
      toValue: 1,
      duration: rotateDuration,
      useNativeDriver: true,
    }).start(() => {
      const result = randomValue < 0.5 ? 'Cara' : 'Cruz';

      if (result === 'Cara') {
        setShowWinAnimation(true);
        Animated.sequence([
          Animated.timing(coinAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(coinAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
            delay: 1000,
          }),
          Animated.timing(textAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(textAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
            delay: 1000,
          }),
        ]).start(() => {
          setShowWinAnimation(false);

          if (interstitialLoaded && !interstitialDismissed) {
            showInterstitial();
            handleVibration();
          } else if (rewardedInterstitialLoaded) {
            showRewardedInterstitial();
            handleVibration();
          } else if (rewardedLoaded) {
            showRewarded();
            handleVibration();
          } else {
            // Handle the case when neither ad is loaded
          }
        });
        console.log(
          'data public: ' +
            rewardedLoaded +
            ' ' +
            interstitialLoaded +
            ' ' +
            rewardedInterstitialLoaded,
        );
        console.log(user.uid);
      }
    });
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [{rotate: rotateInterpolate}],
  };

  const coinOpacityInterpolate = coinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const coinAnimatedStyle = {
    opacity: coinOpacityInterpolate,
  };

  const textOpacityInterpolate = textAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const textAnimatedStyle = {
    opacity: textOpacityInterpolate,
  };

  useEffect(() => {
    console.log(
      'data public: ' +
        interstitialDismissed +
        ' ' +
        rewardedDismissed +
        ' ' +
        rewardedIntertitialDismissed,
    );
  }, [interstitialDismissed, rewardedDismissed, rewardedDismissed]);

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <View style={{backgroundColor: 'white', width: '100%', height: '100%'}}>
      <ImageBackground
        source={require('../../../Assets/fondo.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={{opacity: 0.08}}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <StatusBar backgroundColor={'transparent'} barStyle="light-content" />
          <View style={styles.container}>
            <NavBar name={'Ruleta'} />
            <BannerAd
              unitId="ca-app-pub-3477493054350988/1457774401"
              size={BannerAdSize.ADAPTIVE_BANNER}
            />
            <Text style={styles.title}>
              Bienvenido, el pollito Tommy te saluda
            </Text>
            <View style={styles.containerCoin}>
              <TouchableOpacity onPress={flipCoin}>
                <Animated.Image
                  source={require('../../../Assets/coin-pt.png')}
                  style={[{width: 200, height: 200}, animatedStyle]}
                />
              </TouchableOpacity>
              {showWinAnimation &&
                (!interstitialDismissed ||
                  !rewardedDismissed ||
                  !rewardedIntertitialDismissed) && (
                  <Animated.View
                    style={[styles.winContainer, textAnimatedStyle]}>
                    <Text style={styles.plusOne}>+1</Text>
                    <Animated.Image
                      source={require('../../../Assets/coin-pt.png')}
                      style={[styles.coinImage, coinAnimatedStyle]}
                    />
                  </Animated.View>
                )}
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
  containerCoin: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  winContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '70%',
    left: '25%',
    transform: [{translateX: -50}, {translateY: -50}],
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 10,
    padding: 20,
  },
  coinImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  plusOne: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default RuletaGame;
