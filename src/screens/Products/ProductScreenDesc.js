import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import Icons from '../../components/Icons';
import { useNavigation } from '@react-navigation/native';
import { BannerAd, BannerAdSize } from '@react-native-admob/admob';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { auth, db } from '../../../config';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#FF4B3E',
  secondary: '#2A2A2A',
  background: '#FFFFFF',
  text: '#1A1A1A',
  textLight: '#757575',
  success: '#4CAF50',
};

const ProductScreenDesc = ({ route }) => {
  const { nameCombo, price, desc, url, star, id } = route.params.product;
  const navigation = useNavigation();
  const [isInFav, setIsInFav] = useState(false);
  const [userId, setUserId] = useState(null);
  const scrollY = new Animated.Value(0);

  // Efectos de animación para la imagen
  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const userQuery = query(
          collection(db, 'users'),
          where('mail', '==', auth.currentUser.email)
        );
        
        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const currentUserId = userDoc.id;
          setUserId(currentUserId);

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
      {/* Header flotante */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}>
          <Icons name="arrow-left" sizes={22} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={toggleFavorite}>
          <Icons
            name={isInFav ? "heart" : "hearto"}
            sizes={22}
            color={isInFav ? COLORS.primary : COLORS.text}
          />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Imagen con zoom */}
        <Animated.View style={[styles.imageContainer, { transform: [{ scale: imageScale }] }]}>
          <Image style={styles.imgProduct} source={{ uri: url }} />
        </Animated.View>

        <View style={styles.contentContainer}>
          {/* Información del producto */}
          <View style={styles.productInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.productTitle}>{nameCombo}</Text>
              <View style={styles.ratingContainer}>
                <Icons name="star" sizes={16} color="#FFD700" />
                <Text style={styles.productStar}>{star}</Text>
              </View>
            </View>
            <Text style={styles.productPrice}>${price}</Text>
          </View>

          {/* Descripción */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.productDesc}>{desc}</Text>
          </View>

          {/* Banner de publicidad */}
          <BannerAd
            unitId="ca-app-pub-3477493054350988/1457774401"
            size={BannerAdSize.ADAPTIVE_BANNER}
          />

          {/* Botones de acción */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.btnAddCart}
              onPress={() => navigation.navigate('CartScreen')}>
              <Icons name="shopping-cart" sizes={20} color={COLORS.primary} />
              <Text style={styles.btnCartText}>Agregar al carrito</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.btnBuy}
              onPress={() => navigation.navigate('BuyScreenDetail')}>
              <Text style={styles.btnBuyText}>Comprar ahora</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Banner inferior */}
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
    backgroundColor: COLORS.background,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: width,
    height: 400,
    backgroundColor: '#f5f5f5',
  },
  imgProduct: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  productInfo: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 8,
    borderRadius: 12,
  },
  productStar: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
    color: COLORS.text,
  },
  productPrice: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 8,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  productDesc: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textLight,
  },
  actionButtons: {
    marginVertical: 24,
    gap: 12,
  },
  btnAddCart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 75, 62, 0.1)',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  btnCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  btnBuy: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnBuyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
});

export default ProductScreenDesc;