import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export const OrderList = ({name, url, isClosed, id}) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image style={styles.img} source={url} />
      <View style={styles.textContainer}>
        <Text style={styles.textColor}>{name}</Text>
        <Text style={styles.textColor}>#{id}</Text>
        {isClosed == 0 ? (
          <Text style={styles.textColorActive}>{isClosed}</Text>
        ) : (
          <Text style={styles.textColorSell}>{isClosed}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    width: '95%',
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    margin: 10,
    borderRadius: 10,
    padding: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
  textColor: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textColorActive: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'red',
    borderRadius: 100,
    width: 25,
    height: 25,
  },
  textColorSell: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'green',
    borderRadius: 100,
    width: 25,
    height: 25,
  },
  img: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
});

export default OrderList;
