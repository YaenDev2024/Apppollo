import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icons from './Icons';
import { auth } from '../../config';
import { useNavigation } from '@react-navigation/native';

const {height} = Dimensions.get('window');
const COLORS = {
    dark: 'black',
    darkSecondary: '#4A311F',
    primary: '#FFD23F',
    primaryLight: '#FFE584',
    accent: '#FF6B6B',
    background: 'white',
  };

const ModalPerfilUser = ({onClose, visible}) => {
  const pan = useRef(new Animated.Value(height)).current;

  const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      Animated.timing(pan, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          pan.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100) {
          onClose();
        } else {
          Animated.spring(pan, {toValue: 0, useNativeDriver: true}).start();
        }
      },
    }),
  ).current;

  const handleLogout = async () => {
    try {
      await auth.signOut();

      GoogleSignin.revokeAccess();
    } catch (err) {
      console.log('Error al cerrar sesion: ', err.message);
    }
  };



  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        <Animated.View
          style={[styles.modalContainer, {transform: [{translateY: pan}]}]}
          {...panResponder.panHandlers}>
          <View style={styles.handle} />
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={()=> navigation.navigate('UserPerfil')}>
              <Icons name="user" sizes={18} color="white" />
              <Text style={styles.optionText}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={()=> navigation.navigate('ConfigUser')}>
              <Icons name="cog" sizes={18} color="white" />
              <Text style={styles.optionText}>Configuracion</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.option, styles.deleteOption]} onPress={handleLogout}>
              <Icons name="logout" sizes={22} color="#ff4d4d" />
              <Text style={[styles.optionText, styles.deleteText]}>
                Cerrar Sesion
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: '#888',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  optionsContainer: {
    marginTop: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    marginBottom: 8,
  },
  deleteOption: {
    backgroundColor: '#f9eaea',
  },
  optionText: {
    color: COLORS.dark,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  deleteText: {
    color: '#ff4d4d',
    fontWeight: '600',
  },
});

export default ModalPerfilUser;
