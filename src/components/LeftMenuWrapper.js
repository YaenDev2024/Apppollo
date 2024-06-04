// LeftMenuWrapper.js
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  Dimensions
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MenuContext} from '../hooks/MenuContext';
import Icons from './Icons';
import {auth, db} from '../../config';
import coin from '../../Assets/coin-pt.png';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const LeftMenuWrapper = () => {
  const {menuVisible, hideMenu} = useContext(MenuContext);
  const navigation = useNavigation();
  const signedInUser = auth.currentUser;
  const windowWidth = Dimensions.get('window').width;

  const dataArray = [
    {name: 'Inicio', to: 'Home', icon: 'home'},
    {name: 'Cuenta', to: 'Account', icon: 'user'},
    {name: 'Ajustes', to: 'Settings', icon: 'cog'},
    {name: 'Acerca de Nosotros', to: 'AboutUs', icon: 'info-circle'},
  ];

  const [coins, setCoins] = useState(0);

  const handleCoin = () => {
    hideMenu();
    navigation.navigate('Win');
  };

  useEffect(() => {
    if (signedInUser) {
      const fetchData = async () => {
        try {
          const q = query(collection(db, 'users'), where('mail', '==', signedInUser.email));
          const unsubscribe = onSnapshot(q, querySnapshot => {
            querySnapshot.forEach(doc => {
              if (doc.exists) {
                setCoins(doc.data().coins || 0); // Asegurarse de que coins existe
              }
            });
          });
          return () => unsubscribe(); // Desuscribirse cuando el componente se desmonte
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
      };

      fetchData();
    }
  }, [signedInUser]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={menuVisible}
      onRequestClose={hideMenu}>
      <View style={styles.modalBackground}>
        <View style={[styles.menuContainer, { width: windowWidth * 0.8 }]}>
          {signedInUser ? (
            <View style={styles.containerData}>
              <Image
                style={styles.imgPerfil}
                source={{uri: signedInUser.photoURL}}
              />
              <View style={styles.userInfo}>
                <Text style={styles.name}>{signedInUser.displayName}</Text>
                <Text style={styles.name}>Coins: {coins} <Image style={styles.coin} source={coin}/></Text>
              </View>
             
            </View>
          ) : null}
          <TouchableOpacity onPress={hideMenu} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>
              <Icons name={'close'} sizes={25} />
            </Text>
          </TouchableOpacity>
          <View style={styles.containerBtns}>
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
    alignItems: 'flex-start',
  },
  menuContainer: {
    height: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    paddingTop: 20,
  },
  coin: {
    width: 30,
    height: 30
  },
  name: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700'
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  containerBtns: {
    marginTop: 0,
  },
  imgPerfil: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  containerData: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 1,
    width: '100%',
    backgroundColor: '#EC1D1D',
    height:120,
    top:-20
  },
  closeButton: {
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    right: -30,
    top: 10,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  btnMenu: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textbtn: {
    marginLeft: 20,
    color: 'gray',
    fontWeight: 'bold',
  },
});

export default LeftMenuWrapper;
