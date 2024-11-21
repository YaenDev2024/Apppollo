import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Icons from '../../components/Icons';
import {useNavigation} from '@react-navigation/native';
import {BannerAd, BannerAdSize} from '@react-native-admob/admob';
import {
  collection, 
  getDocs, 
  query, 
  where,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { auth, db } from '../../../config';

const COLORS = {
  dark: 'black',
  darkSecondary: '#4A311F',
  primary: '#FFD23F',
  primaryLight: '#FFE584',
  accent: '#FF6B6B',
  background: 'white',
};

const ProductScreenDesc = ({route}) => {
  const {nameCombo, price, desc, url, star, id} = route.params.product;
  const navigation = useNavigation();

  const [isInFav, setIsInFav] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        // Obtener el ID del usuario actual
        const userQuery = query(
          collection(db, 'users'),
          where('mail', '==', auth.currentUser.email)
        );
        
        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const currentUserId = userDoc.id;
          setUserId(currentUserId);

          // Verificar si el combo está en favoritos
          const favQuery = query(
            collection(db, 'favoritos'),
            where('iduser', '==', currentUserId),
            where('idcombo', '==', id)
          );

          const favSnapshot = await getDocs(favQuery);
          setIsInFav(!favSnapshot.empty);
        }
      } catch (error) {
        console.error('Error checking favorites:', error);
        Alert.alert('Error', 'No se pudo verificar favoritos');
      }
    };

    checkFavoriteStatus();
  }, []);

  const toggleFavorite = async () => {
    try {
      if (!userId) return;

      if (isInFav) {
        // Eliminar de favoritos
        const favQuery = query(
          collection(db, 'favoritos'),
          where('iduser', '==', userId),
          where('idcombo', '==', id)
        );
        
        const favSnapshot = await getDocs(favQuery);
        
        favSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        setIsInFav(false);
      } else {
        // Agregar a favoritos
        await addDoc(collection(db, 'favoritos'), {
          iduser: userId,
          idcombo: id
        });

        setIsInFav(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'No se pudo modificar favoritos');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btnrounded}
          onPress={() => navigation.goBack()}>
          <Icons name="arrow-left" sizes={25} color={COLORS.dark} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.btnrounded}
          onPress={toggleFavorite}
        >
          <Icons 
            name={isInFav ? "heart" : "hearto"} 
            sizes={25} 
            color={COLORS.dark} 
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View>
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

        <View style={styles.btnBuyContainer}>
          <TouchableOpacity style={styles.btnBuy} onPress={() => navigation.navigate('Pay')}>
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
