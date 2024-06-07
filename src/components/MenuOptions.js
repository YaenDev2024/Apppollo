import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export const MenuOptions = ({ name, url, navigation, To, desc }) => {
  const handleNavigate = () => {
    navigation.navigate(To);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleNavigate}>
      <View style={styles.imageContainer}>
        <Image style={styles.img} source={url} />
        <TouchableOpacity style={styles.heartIcon}>
        </TouchableOpacity>
        <View style={styles.timeLeft}>
          <Text style={styles.timeLeftText}>Tiempo Actual:</Text>
          <Text style={styles.timeLeftValue}>{new Date().toDateString()}</Text>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.artist}>{desc}</Text>
        <View style={styles.profilePics}>
        </View>
        <TouchableOpacity style={styles.bidButton}>
          <Text style={styles.bidButtonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    width: screenWidth - 80,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  img: {
    width: '100%',
    height: 150,
    resizeMode:'contain'
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
  timeLeft: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderColor:'gray',
    borderWidth:0.5
  },
  timeLeftText: {
    fontSize: 10,
    color: '#555',
  },
  timeLeftValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  artist: {
    fontSize: 14,
    color: 'gray',
  },
  profilePics: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bidButton: {
    marginTop: 10,
    backgroundColor: '#000',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  bidButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
