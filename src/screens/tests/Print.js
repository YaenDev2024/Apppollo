import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import RNPrint from 'react-native-print';

const PrintImage = ({ image }) => {
  const [printing, setPrinting] = useState(false);

  const handlePrint = async () => {
    if (!image) {
      Alert.alert('No image to print');
      return;
    }

    try {
      setPrinting(true);
      await RNPrint.print({
        filePath: image,
      });
    } catch (error) {
      console.error('Failed to print image:', error);
    } finally {
      setPrinting(false);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: printing ? 'gray' : '#E9EBED' }]}
        onPress={handlePrint}
        disabled={printing}
      >
        <Text style={{ color: 'black' }}>{printing ? 'Printing...' : 'Print Image'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    backgroundColor: '#E9EBED',
    borderColor: '#f4f5f6',
    borderWidth: 1,
  },
});

export default PrintImage;
