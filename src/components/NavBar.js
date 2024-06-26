import React, {useContext, useEffect, useRef, useState} from 'react';
import Icons from './Icons';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';
import {getAuth} from 'firebase/auth';
import {MenuContext} from '../hooks/MenuContext';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const auth = getAuth();

export const NavBar = ({name}) => {
  const {showMenu} = useContext(MenuContext);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '58442434849-5ejnse52ethv4v25u7nm0la5dri7h8k1.apps.googleusercontent.com',
    });
  }, []);
  const handleLogout = async () => {
    try {
      await auth.signOut();

      GoogleSignin.revokeAccess();
    } catch (err) {
      console.log('Error al cerrar sesion: ', err.message);
    }
  };

  return (
    <View style={styles.navbar}>
      <StatusBar backgroundColor={'white'} barStyle="dark-content" />
      <TouchableOpacity onPress={showMenu}>
        <Icons name={'bars'} sizes={25} />
      </TouchableOpacity>
      <Text style={styles.title}>{name}</Text>
      <TouchableOpacity onPress={() => handleLogout()}>
        <Icons name={'logout'} sizes={25} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: 'white',
    width: '100%',
    height: '7%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    marginLeft: 20,
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
  },
  menuContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
});
