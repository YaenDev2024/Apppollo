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
import {BannerAd, BannerAdSize} from '@react-native-admob/admob';
const COLORS = {
  dark: 'black',
  darkSecondary: '#4A311F',
  primary: '#FFD23F',
  primaryLight: '#FFE584',
  accent: '#FF6B6B',
  background: 'white',
};
const ProductScreenDesc = ({route}) => {
  const {nameCombo, price, desc, url, star} = route.params.product;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        {/* BOTONES */}
        <TouchableOpacity
          style={styles.btnrounded}
          onPress={() => navigation.goBack()}>
          <Icons name="arrow-left" sizes={25} color={COLORS.dark} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnrounded}>
          <Icons name="heart" sizes={25} color={COLORS.dark} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View>
          {/* img */}
          <Image style={styles.imgProduct} source={{uri: url}} />
          <BannerAd
            unitId="ca-app-pub-3477493054350988/1457774401"
            size={BannerAdSize.ADAPTIVE_BANNER}
          />
        </View>
        <View style={styles.productDescription}>
          <Text style={styles.productTitle}>{nameCombo}</Text>
          <Text style={styles.productStar}>⭐{star}</Text>
          <Text style={styles.productDesc}>{desc}</Text>
          <Text style={styles.productPrice}>${price}</Text>
        </View>

        {/* Buy Button */}
        <View style={styles.btnBuyContainer}>
          <TouchableOpacity style={styles.btnBuy}>
            <Text style={styles.btnBuyText}>Comprar</Text>
          </TouchableOpacity>
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
  productDescription: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  productTitle: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 35,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#ff6600',
  },
  productStar: {
    fontSize: 20,
    marginTop: 20,
    color: '#ff6600',
  },
  productDesc: {
    fontSize: 20,
    marginTop: 20,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  btnrounded: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
  },
  imgProduct: {
    width: '100%',
    height: 300,
    objectFit: 'cover',
  },
  btnBuyContainer: {
    padding: 10,
  },
  btnBuy: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
  },
  btnBuyText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default ProductScreenDesc;
