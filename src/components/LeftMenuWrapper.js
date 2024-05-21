// LeftMenuWrapper.js
import React, {useContext} from 'react';
import {View, Modal, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {LeftMenu} from './LeftMenu';
import {MenuContext} from '../hooks/MenuContext';
import Icons from './Icons';
import {MenuOptions} from './MenuOptions';
import inventory from '../../Assets/inventory-removebg-preview.png';
import buy from '../../Assets/cmcarritos.png';
import { useNavigation } from '@react-navigation/native';

const LeftMenuWrapper = () => {
  const {menuVisible, hideMenu} = useContext(MenuContext);
 
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={menuVisible}
      onRequestClose={hideMenu}>
      <View style={styles.modalBackground}>
        <View style={styles.menuContainer}>
          <Text style={styles.textMenuP}>Hola</Text>
          <TouchableOpacity onPress={hideMenu} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>
              <Icons name={'close'} sizes={25} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  menuContainer: {
    width: '80%',
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
    position: 'absolute',
    left: 0,
  },
  closeButton: {
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    right: -30,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  textMenuP: {
    color: 'black',
  },
});

export default LeftMenuWrapper;
