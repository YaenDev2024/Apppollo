import React, { useEffect, useState, useCallback } from 'react';
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
import { NavBar } from '../../components/NavBar';
import {
  BannerAd,
  BannerAdSize,
  useRewardedAd,
  useInterstitialAd,
  useRewardedInterstitialAd,
} from '@react-native-admob/admob';
import { useAuth } from '../../hooks/useAuth';
import { auth, db } from '../../../config';
import { collection, onSnapshot, query, where, doc, updateDoc, getDocs } from 'firebase/firestore';

const RuletaGame = () => {
  const [rotation] = useState(new Animated.Value(0));
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [coinAnimation] = useState(new Animated.Value(0));
  const [textAnimation] = useState(new Animated.Value(0));

  const {
    adLoaded: interstitialLoaded,
    adDismissed: interstitialDismissed,
    load: loadInterstitial,
    show: showInterstitial,
  } = useInterstitialAd('ca-app-pub-3477493054350988/8755348914');

  const {
    adLoaded: rewardedLoaded,
    adDismissed: rewardedDismissed,
    load: loadRewarded,
    show: showRewarded,
  } = useRewardedAd('ca-app-pub-3477493054350988/8242528814');

  const {
    adLoaded: rewardedInterstitialLoaded,
    adDismissed: rewardedInterstitialDismissed,
    load: loadRewardedInterstitial,
    show: showRewardedInterstitial,
  } = useRewardedInterstitialAd('ca-app-pub-3477493054350988/3027142417');

  const { user } = useAuth();
  const [coins, setCoins] = useState(0);
  const [eCPM, seteCPM] = useState(0);
  const [cruz, setCruz] = useState(false);
  const signedInUser = auth.currentUser;

  const updateCoin = async () => {
    if (signedInUser) {
      const userQuery = query(
        collection(db, 'users'),
        where('mail', '==', signedInUser.email)
      );

      try {
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userRef = doc(db, 'users', userDoc.id);
          await updateDoc(userRef, {
            coins: coins + 1,
          });
          setCoins(coins + 1);
        } else {
          console.error('No user found with the provided email.');
        }
      } catch (error) {
        console.error('Error updating coins:', error);
      }
    }
  };

  const handleVibration = useCallback(() => {
    Vibration.vibrate();
  }, []);

  const flipCoin = useCallback(() => {
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
        ]).start(async () => {
          setShowWinAnimation(true);
          if (interstitialLoaded) {
            showInterstitial();
            await updateCoin();
            handleVibration();
            setShowWinAnimation(false);
          } else if (rewardedInterstitialLoaded) {
            showRewardedInterstitial();
            await updateCoin();
            handleVibration();
            setShowWinAnimation(false);
          } else if (rewardedLoaded) {
            showRewarded();
            await updateCoin();
            handleVibration();
            setShowWinAnimation(false);
          } else {
            Alert.alert(
              'No hay anuncios disponibles en este momento. Inténtalo más tarde.',
            );
          }
        });
      } else {
        setCruz(true);
      }
    });
  }, [
    rotation,
    coinAnimation,
    textAnimation,
    interstitialLoaded,
    showInterstitial,
    rewardedInterstitialLoaded,
    showRewardedInterstitial,
    rewardedLoaded,
    showRewarded,
    handleVibration,
  ]);

  useEffect(() => {
    if (interstitialDismissed) {
      loadInterstitial();
    }
    if (rewardedDismissed) {
      loadRewarded();
    }
    if (rewardedInterstitialDismissed) {
      loadRewardedInterstitial();
    }
  }, [
    interstitialDismissed,
    rewardedDismissed,
    rewardedInterstitialDismissed,
    loadInterstitial,
    loadRewarded,
    loadRewardedInterstitial,
  ]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const coinOpacityInterpolate = coinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const coinAnimatedStyle = {
    opacity: coinOpacityInterpolate,
    width: 50,  // tamaño reducido
    height: 50,  // tamaño reducido
  };

  const textOpacityInterpolate = textAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const textAnimatedStyle = {
    opacity: textOpacityInterpolate,
  };

  const [itApprovedBanner, setitApprovedBanner] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCruz(false);
    }, 2000);
  }, [cruz]);

  useEffect(() => {
    if (signedInUser) {
      const fetchData = async () => {
        try {
          const q = query(
            collection(db, 'users'),
            where('mail', '==', signedInUser.email),
          );
          const unsubscribe = onSnapshot(q, querySnapshot => {
            querySnapshot.forEach(doc => {
              if (doc.exists) {
                setCoins(doc.data().coins || 0);
              }
            });
          });
          return () => unsubscribe();
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
      };

      fetchData();
    }
  }, [signedInUser]);

  useEffect(() => {
    const fetcheCPM = async () => {
      try {
        const q = query(collection(db, 'eCPM'));
        const unsubscribe = onSnapshot(q, querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.exists) {
              let reward = (doc.data().eCPM / 1000) * coins;
              seteCPM(reward.toFixed(3));
            }
          });
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    fetcheCPM();
  }, [coins]);

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
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../Assets/fondo.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={{ opacity: 0.1 }}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <StatusBar backgroundColor={'transparent'} barStyle="dark-content" />
          <NavBar name={'Ruleta'} />
          {itApprovedBanner ? (
            <BannerAd
              unitId="ca-app-pub-3477493054350988/1457774401"
              size={BannerAdSize.ADAPTIVE_BANNER}
            />
          ) : null}
          <View style={styles.content}>
          <Text style={styles.title}>Bienvenido, el pollito Tommy te saluda</Text>
            <Text style={styles.description}>
              La ruleta es un juego de suerte, donde al darle clic tienes la
              oportunidad de ganar coins. Pon a prueba tu suerte y dale clic a la
              moneda con el pollito Tommy.
            </Text>
            <View style={styles.stats}>
              <Text style={styles.coinsText}>Tus coins: {coins}</Text>
              <Text style={styles.equivalentText}>≈ ${eCPM} pesos</Text>
            </View>
            <View style={styles.coinContainer}>
              <TouchableOpacity
                onPress={flipCoin}
                disabled={cruz}
                style={cruz && styles.disabledButton}>
                <Animated.Image
                  source={require('../../../Assets/coin-pt.png')}
                  style={[styles.coinImage, animatedStyle]}
                />
              </TouchableOpacity>
              {cruz && (
                <Text style={styles.losingText}>
                  Lo siento, no ganaste nada. Vuelve a intentarlo.
                </Text>
              )}
              <Text style={styles.tryAgainText}>¡Vamos, inténtalo!</Text>
              {showWinAnimation && (
                <Animated.View style={[styles.winContainer, textAnimatedStyle]}>
                  <Text style={styles.plusOne}>+1</Text>
                  <Animated.Image
                    source={require('../../../Assets/coin-pt.png')}
                    style={[styles.smallCoinImage, coinAnimatedStyle]}
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
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  coinsText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  equivalentText: {
    fontSize: 18,
    color: 'orange',
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  coinContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  coinImage: {
    width: 200,
    height: 200,
  },
  smallCoinImage: {
    width: 30,  // tamaño pequeño
    height: 30,  // tamaño pequeño
  },
  losingText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  tryAgainText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 10,
  },
  winContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '60%',
    left: '60%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 10,  
   
  },
  plusOne: {
    fontSize: 16,  
    fontWeight: 'bold',
    color: 'green',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default RuletaGame;
