import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BannerAd, BannerAdSize } from '@react-native-admob/admob';
import * as Progress from 'react-native-progress';
import Icons from '../../components/Icons';

const QuizGame = ({ navigation }) => {
  const [start, setStart] = useState(false);

  const onPressBack = () => {
    navigation.navigate('Win');
  };

  const startGame = () => {
    setStart(true);
  };

  const AnswerOption = ({ answer, id }) => (
    <TouchableOpacity style={styles.cardAnswer}>
      <Text style={styles.answerText}>
        <Text style={styles.answerId}>{id}.</Text>
        {answer}
      </Text>
    </TouchableOpacity>
  );

  const renderQuestions = () => {
    return questions.map((item, index) => (
      <View key={index} style={styles.questionContainer}>
        <Text style={styles.questionText}>
          <Text style={styles.questionId}>{item.id}.</Text>
          {item.question}
        </Text>
        {item.options.map((option, i) => (
          <AnswerOption key={i} id={option.key} answer={option.label} />
        ))}
      </View>
    ));
  };

  const questions = [
    {
      id: 1,
      question: '¿Cuántos años son 4 décadas?',
      options: [
        { label: 'Son 10 años', key: 'A' },
        { label: 'Son 5 años', key: 'B' },
        { label: 'Son 20 años', key: 'C' },
        { label: 'Son 19 años', key: 'D' },
      ],
      correctAnswer: 'C',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {start ? (
        <View style={styles.gameContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onPressBack}>
            <Icons name="arrow-left" sizes={30} />
          </TouchableOpacity>
          <View style={styles.timerContainer}>
            <Text style={styles.timeText}>Tiempo restante 1:00Min</Text>
            <Text style={styles.quizText}>1/20</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <Progress.Bar
              progress={0.3}
              height={15}
              borderRadius={10}
              width={null}
              color="#DE3A3A"
            />
            <BannerAd
              unitId="ca-app-pub-3477493054350988/1457774401"
              size={BannerAdSize.ADAPTIVE_BANNER}
            />
          </View>
          <View style={styles.quizContainer}>{renderQuestions()}</View>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={onPressBack}>
            <Icons name="arrow-right" sizes={30} />
          </TouchableOpacity>
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
    
    backgroundColor: 'white',
  },
  gameContainer: {
    flex: 1,
    padding: 15,
  },
  backButton: {
    width: '15%',
    marginBottom: 15,
  },
  timerContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: 'black',
    fontWeight: 'bold',
  },
  quizText: {
    color: '#DE3A3A',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    marginTop: 15,
  },
  quizContainer: {
    marginVertical: 10,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'black',
  },
  questionId: {
    color: '#DE3A3A',
    fontWeight: 'bold',
  },
  cardAnswer: {
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 60,
    justifyContent: 'center',
  },
  answerText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '500',
  },
  answerId: {
    color: '#DE3A3A',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#DE3A3A',
    padding: 20,
    borderRadius: 50,
    width: 69,
    height: 69,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center', // Centrar verticalmente
    alignItems: 'center', // Centrar horizontalmente
    padding: 15,
  },
  welcomeText: {
    color: 'black',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center', // Alineación central del texto
  },
  startButton: {
    backgroundColor: '#DE3A3A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuizGame;
