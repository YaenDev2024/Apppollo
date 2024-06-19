import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  useInterstitialAd,
  useRewardedAd,
  useRewardedInterstitialAd,
} from '@react-native-admob/admob';
import * as Progress from 'react-native-progress';
import Icons from '../../components/Icons';
import q from '../../filesJSON/questions.json';
import { auth, db } from '../../../config';
import {
  collection,
  query,
  where,
  doc,
  updateDoc,
  getDocs,
} from 'firebase/firestore';

const QuizGame = ({ navigation }) => {
  const [start, setStart] = useState(false);
  const [time, setTime] = useState(60);
  const [progress, setProgress] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const signedInUser = auth.currentUser;
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(false);


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

  const timerRef = useRef(null);

  const updateCoin = async () => {
    if (signedInUser) {
      const userQuery = query(
        collection(db, 'users'),
        where('mail', '==', signedInUser.email),
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

  useEffect(() => {
    if (rewardedDismissed) {
      loadRewarded();
    }
    if (rewardedInterstitialDismissed) {
      loadRewardedInterstitial();
    }
    if (interstitialDismissed) {
      loadInterstitial();
    }
  }, [rewardedDismissed, rewardedInterstitialDismissed,interstitialDismissed, loadRewarded, loadRewardedInterstitial, loadInterstitial]);

  const originalQuestions = q;

  useEffect(() => {
    const loadRandomQuestions = () => {
      const shuffled = [...originalQuestions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledQuestions(shuffled);
    };

    if (start) {
      loadRandomQuestions();
    }
  }, [start, originalQuestions]);

  useEffect(() => {
    if (start) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 0) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            Alert.alert('Finalizo el tiempo');
            setStart(false);
            setProgress(0);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [start]);

  const onPressBack = () => {
    navigation.navigate('Win');
  };

  const startGame = () => {
    setStart(true);
    setTime(30);
    setCoins(0);
  };

  const doubleCoins = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    if (rewardedInterstitialLoaded) {
      showRewardedInterstitial();
    } else if (rewardedLoaded) {
      showRewarded();
    } else if (interstitialLoaded) {
      showInterstitial();
      await updateCoin();
    } else {

      Alert.alert(
        'No hay anuncios disponibles en este momento. Inténtalo más tarde.',
      );

    }
    // await updateCoin();
    setLoading(false);
  }, [rewardedInterstitialLoaded, showRewardedInterstitial, rewardedLoaded, showRewarded, loading]);

  const handleAnswer = selectedAnswer => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setCorrectAnswers(correctAnswers + 1);
      setCoins(prevCoins => prevCoins + 1);
      setProgress((correctAnswers + 1) / shuffledQuestions.length);
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        onPressBack();
      }
    } else {
      Alert.alert('Fallaste', 'Respuesta incorrecta! Vuelve a intentarlo.');
    }
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const AnswerOption = ({ answer, id, onPress }) => (
    <TouchableOpacity style={styles.cardAnswer} onPress={onPress}>
      <Text style={styles.answerText}>
        <Text style={styles.answerId}>{id}.</Text>
        {answer}
      </Text>
    </TouchableOpacity>
  );

  const renderQuestions = () => {
    if (shuffledQuestions.length === 0) {
      return null;
    }

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          <Text style={styles.questionId}>Q.</Text>
          {currentQuestion.question}
        </Text>
        {currentQuestion.options.map((option, i) => (
          <AnswerOption
            key={i}
            id={option.key}
            answer={option.label}
            onPress={() => handleAnswer(option.key)}
          />
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {start ? (
        <View style={styles.gameContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onPressBack}>
            <Icons
              name="arrow-left"
              sizes={Dimensions.get('window').width * 0.08}
            />
          </TouchableOpacity>
          <View style={styles.timerContainer}>
            <Text style={styles.timeText}>
              Tiempo restante {formatTime(time)}
            </Text>
            <Text style={styles.quizTextCoins} >
              Coins ganados:{coins}
              <Image
                source={require('../../../Assets/coin-pt.png')}
                style={{ height: 25, width: 25 }}
              />
            </Text>

            <Text style={styles.quizText}>
              {currentQuestionIndex + 1}/{shuffledQuestions.length}
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <Progress.Bar
              progress={progress}
              height={Dimensions.get('window').width * 0.02}
              borderRadius={10}
              width={null}
              color="#DE3A3A"
            />
          </View>
          <View style={styles.quizContainer}>
            <BannerAd
              unitId="ca-app-pub-3477493054350988/1457774401"
              size={BannerAdSize.ADAPTIVE_BANNER}
            />
            {renderQuestions()}
            <TouchableOpacity style={styles.nextButton} onPress={doubleCoins}>
              <Icons name="cash" sizes={Dimensions.get('window').width * 0.1} />
            </TouchableOpacity>
            <BannerAd
              unitId="ca-app-pub-3477493054350988/1457774401"
              size={BannerAdSize.ADAPTIVE_BANNER}
            />
          </View>
        </View>
      ) : (
        <View style={styles.startContainer}>
          <Text style={styles.welcomeText}>¡Bienvenido!</Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Comenzar</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameContainer: {
    flex: 1,
    width: '100%',
    padding: Dimensions.get('window').width * 0.05,
  },
  backButton: {
    position: 'absolute',
    top: Dimensions.get('window').width * 0.05,
    left: Dimensions.get('window').width * 0.05,
    zIndex: 1,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Dimensions.get('window').width * 0.01,
    marginTop: Dimensions.get('window').width * 0.1,
  },
  timeText: {
    color: 'black',
    fontWeight: 'bold',
  },
  quizText: {
    color: '#DE3A3A',
    fontWeight: 'bold',
  },
  quizTextCoins: {
    top: -8,
    color: 'orange',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    marginVertical: Dimensions.get('window').width * 0.04,
  },
  quizContainer: {
    alignItems: 'center',
  },
  questionContainer: {
    marginBottom: Dimensions.get('window').width * 0.1,
    width: '100%',
  },
  questionText: {
    fontSize: Dimensions.get('window').width * 0.06,
    fontWeight: '500',
    color: 'black',
  },
  questionId: {
    color: '#DE3A3A',
    fontWeight: 'bold',
  },
  cardAnswer: {
    marginVertical: Dimensions.get('window').width * 0.02,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: Dimensions.get('window').width * 0.03,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    height: Dimensions.get('window').width * 0.15,
    justifyContent: 'center',
  },
  answerText: {
    color: 'black',
    fontSize: Dimensions.get('window').width * 0.045,
    fontWeight: '500',
  },
  answerId: {
    color: '#DE3A3A',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#DE3A3A',
    padding: Dimensions.get('window').width * 0.03,
    borderRadius: Dimensions.get('window').width * 0.08,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: Dimensions.get('window').width * 0.05,
    marginBottom: Dimensions.get('window').width * 0.05,
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Dimensions.get('window').width * 0.1,
  },
  welcomeText: {
    color: 'black',
    fontSize: Dimensions.get('window').width * 0.08,
    marginBottom: Dimensions.get('window').width * 0.1,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#DE3A3A',
    paddingVertical: Dimensions.get('window').width * 0.04,
    paddingHorizontal: Dimensions.get('window').width * 0.08,
    borderRadius: Dimensions.get('window').width * 0.04,
  },
  startButtonText: {
    color: 'white',
    fontSize: Dimensions.get('window').width * 0.05,
    fontWeight: 'bold',
  },
});

export default QuizGame;
