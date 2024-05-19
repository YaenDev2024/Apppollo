// LeftMenu.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const LeftMenu = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Left Menu Content</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title:{
    color:'black'
  }
});
