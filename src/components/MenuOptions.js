import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export const MenuOptions = ({name, url, navigation, To}) => {
    const handleNavigate = ()=>{
        navigation.navigate(To);
    }
  return (
    <TouchableOpacity style={styles.card} onPress={() => handleNavigate()}>
      <Image style={styles.img} source={url} />
      <Text style={styles.textColor}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    width: '80%',
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 10,
    borderRadius: 10,
  },
  textColor: {
    color: 'black',
    padding: 20,
    margin: 15,
    fontWeight: 'bold',
    fontSize: 18,
  },
  img: {
    width: 90,
    height: 90,
  },
});
