import React, {useEffect, useState} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export const ModalOrdersToSelect = ({isActive, onClose}) => {
  const [active, setActive] = useState(isActive);

  useEffect(() => {
    setActive(isActive);
  }, [isActive]);


  useEffect(()=>{

  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={active}
      onRequestClose={() => {
        setActive(false);
        onClose();
      }}>
      <View style={styles.centeredView}>
        <View style={styles.card}>
          <Text style={styles.title}>ModalOrdersToSelect</Text>
          <ScrollView>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'black',
  }, 
  card: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    flexDirection: 'column',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }, 
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
