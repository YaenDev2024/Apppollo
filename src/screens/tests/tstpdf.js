import React from 'react';
import {StyleSheet, Button, View} from 'react-native';
import email from 'react-native-email';

export const TestPdf = () => {
  const handleEmail = () => {
    const to = ['acostaDtomas.24@gmail.com']; 
    email(to, {
      subject: 'Show how to use',
      body: 'Some body right here',
      checkCanOpen: false, 
    }).catch(console.error);
  };
  return (
    <View style={styles.container}>
      <Button title="Send Mail" onPress={handleEmail} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
