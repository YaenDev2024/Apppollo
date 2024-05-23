import React from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
} from 'react-native';
import Icons from '../components/Icons';
import {MenuOptions} from '../components/MenuOptions';
import inventory from '../../Assets/inventory-removebg-preview.png';
import buy from '../../Assets/cmcarritos.png';
import {NavBar} from '../components/NavBar';
import order from '../../Assets/order.png';
export const HomeScreen = ({navigation}) => {
  return (
    <View style={{backgroundColor: 'white', width: '100%', height: '100%'}}>
      <ImageBackground
        source={require('../../Assets/fondo.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={{opacity: 0.08}}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <StatusBar
            backgroundColor={'transparent'}
            barStyle="light-contentz"
          />
          <View style={styles.container}>
            <NavBar name={'Menu'} />
            <MenuOptions
              name={'Inventario'}
              url={inventory}
              navigation={navigation}
              To={'Inventory'}
            />
            <MenuOptions
              name={'Compras'}
              url={buy}
              navigation={navigation}
              To={'Buy'}
            />
             <MenuOptions
              name={'Ordenes'}
              url={order}
              navigation={navigation}
              To={'Orders'}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'start',
  },
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
});
