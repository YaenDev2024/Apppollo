import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icons from '../../components/Icons';
import {useNavigation} from '@react-navigation/native';
import {auth} from '../../../config';
import { BannerAd, BannerAdSize } from '@react-native-admob/admob';
const COLORS = {
  dark: 'black',
  darkSecondary: '#4A311F',
  primary: '#FFD23F',
  primaryLight: '#FFE584',
  accent: '#FF6B6B',
  background: 'white',
};
const UserPerfil = ({route}) => {
  const navigation = useNavigation();
  const signedInUser = auth.currentUser;
  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        {/* BOTONES */}
        <TouchableOpacity
          style={styles.btnrounded}
          onPress={() => navigation.goBack()}>
          <Icons name="arrow-left" sizes={25} color={COLORS.dark} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnrounded} onPress={() => navigation.navigate('ConfigUser')}>
          <Icons name="cog" sizes={25} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* data user */}
        <View style={styles.datausercontainer}>
          <Image style={styles.imgUser} source={{uri: signedInUser.photoURL}} />
          <Text style={styles.titleName}>{signedInUser.displayName}</Text>
          <Text style={styles.email}>{signedInUser.email}</Text>
        </View>

        {/* card info */}
        <View style={styles.cardInfo}>
          <View style={styles.containerData}>
            <Text style={styles.titleCardCount}>0</Text>
            <Text style={styles.titleCard}>Pedidos</Text>
          </View>
          <View style={styles.containerData}>
            <Text style={styles.titleCardCount}>0</Text>
            <Text style={styles.titleCard}>Favoritos</Text>
          </View>
          <View style={styles.containerData}>
            <Text style={styles.titleCardCount}>0</Text>
            <Text style={styles.titleCard}>Puntos</Text>
          </View>
        </View>
        <BannerAd
          unitId="ca-app-pub-3477493054350988/1457774401"
          size={BannerAdSize.ADAPTIVE_BANNER}
        />
        {/* cards */}
        <View style={styles.card}>
          <View style={styles.squareImg}><Text style={{fontSize:25}}>📦</Text></View>
          <Text style={styles.titleCards}>Mis Pedidos</Text>
          <Icons name="arrow-right" sizes={25} color={COLORS.dark} />
        </View>
        <View style={styles.card}>
          <View style={styles.squareImg}><Icons name="heart" sizes={35} color={COLORS.dark} /></View>
          <Text style={styles.titleCards}>Favoritos</Text>
          <Icons name="arrow-right" sizes={25} color={COLORS.dark} />
        </View>
        <View style={styles.card}>
          <View style={styles.squareImg}><Text style={{fontSize:25}}>🎁</Text></View>
          <Text style={styles.titleCards}>Mis Puntos</Text>
          <Icons name="arrow-right" sizes={25} color={COLORS.dark} />
        </View>
        <View style={styles.card}>
          <View style={styles.squareImg}><Text style={{fontSize:25}}>📍</Text></View>
          <Text style={styles.titleCards}>Direcciones</Text>
          <Icons name="arrow-right" sizes={25} color={COLORS.dark} />
        </View>
        <View style={styles.card}>
          <View style={styles.squareImg}><Text style={{fontSize:25}}>🔔</Text></View>
          <Text style={styles.titleCards}>Notificaciones</Text>
          <Icons name="arrow-right" sizes={25} color={COLORS.dark} />
        </View>
      </ScrollView>
      <BannerAd
          unitId="ca-app-pub-3477493054350988/1457774401"
          size={BannerAdSize.ADAPTIVE_BANNER}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: COLORS.background,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  btnrounded: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
  },
  imgUser: {
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    objectFit: 'cover',
  },
  datausercontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  titleName: {
    fontSize: 35,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  email: {
    fontSize: 18,
    color: 'gray',
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 50,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom:25
  },
  titleCard: {
    fontSize: 16,
    color: 'black',
  },
  containerData: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleCardCount: {
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  titleCards: {
    fontSize: 20,
    color: COLORS.dark,
    fontWeight: 'bold',
  },
  squareImg: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
});
export default UserPerfil;
