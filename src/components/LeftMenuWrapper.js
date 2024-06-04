// LeftMenuWrapper.js
import React, {useContext, useEffect} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MenuContext} from '../hooks/MenuContext';
import Icons from './Icons';
import {useAuth} from '../hooks/useAuth';
import {auth} from '../../config';
import coin from '../../Assets/coin-pt.png';

const LeftMenuWrapper = () => {
  const {menuVisible, hideMenu} = useContext(MenuContext);
  const navigation = useNavigation();
  const signedInUser = auth.currentUser;
  //Agregar todos las opciones que se quieran en el leftmenu
  const dataArray = [
    {name: 'Inicio', to: 'Home', icon: 'home'},
    {name: 'Cuenta', to: 'Account', icon: 'user'},
    {name: 'Ajustes', to: 'Settings', icon: 'cog'},
    {name: 'Acerca de Nosotros', to: 'AboutUs', icon: 'info-circle'},
  ];

  const handleCoin = () => {
    hideMenu();
    navigation.navigate('Win');
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={menuVisible}
      onRequestClose={hideMenu}>
      <View style={styles.modalBackground}>
        <View style={styles.menuContainer}>
          {signedInUser ? (
            <View style={styles.containerData}>
              <Image
                style={styles.imgPerfil}
                source={{uri: signedInUser.photoURL}}
              />
              <Text style={styles.name}>{signedInUser.displayName}</Text>
              <Text style={styles.name}>Coins: 5</Text>
              <Image style={styles.coin} source={coin}/>
            </View>
          ) : (
            ''
          )}
          <TouchableOpacity onPress={hideMenu} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>
              <Icons name={'close'} sizes={25} />
            </Text>
          </TouchableOpacity>
          <View style={styles.conainerBtns}>
            {dataArray.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={handleCoin}
                style={styles.btnMenu}>
                <Text style={styles.closeButtonText}>
                  <Icons name={item.icon} sizes={25} />
                </Text>
                <Text style={styles.textbtn}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    position: 'absolute',
    left: 0,
  },
  coin:{
    width:30,
    height:30,
    marginLeft:-5
  },
  name: {
    color: 'white',
    fontSize: 16,
    fontWeight:'700',
    margin: 10,
  },
  adbanner: {
    width: 10,
  },
  conainerBtns:{
    
  },
  imgPerfil: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  containerData: {
    padding: 10,
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems: 'center',
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 1,
    width: '100%',
    backgroundColor: '#EC1D1D',
    height:120
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
  btnMenu: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textbtn: {
    marginLeft: 30,
    color: 'gray',
    fontWeight:'bold'
  },
});

export default LeftMenuWrapper;
