import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import Icons from '../../components/Icons';
import {useNavigation} from '@react-navigation/native';
import {ShoppingCart} from 'lucide-react-native';
import {BannerAd, BannerAdSize} from '@react-native-admob/admob';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import {auth, db} from '../../../config';
import {Image} from 'react-native';

const {width} = Dimensions.get('window');

const COLORS = {
  primary: '#FF4B3E',
  secondary: '#2A2A2A',
  background: '#FFFFFF',
  text: '#1A1A1A',
  textLight: '#757575',
  success: '#4CAF50',
  gray: '#F5F5F5',
  lightGray: '#E0E0E0',
};

const CartScreen = () => {
  const navigation = useNavigation();
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const scrollY = new Animated.Value(0);
  const [userId, setUserId] = useState(null);
  // Header animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  // Empty cart animation
  const emptyCartScale = new Animated.Value(1);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(emptyCartScale, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(emptyCartScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    let unsubscribe;

    const setupRealtimeCart = async () => {
      try {
        const userQuery = query(
          collection(db, 'users'),
          where('mail', '==', auth.currentUser.email),
        );

        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const currentUserId = userDoc.id;
          setUserId(currentUserId);

          const cartQuery = query(
            collection(db, 'carrito'),
            where('iduser', '==', currentUserId),
          );

          unsubscribe = onSnapshot(cartQuery, async querySnapshot => {
            const cartItemsPromises = querySnapshot.docs.map(async docs => {
              const comboRef = docs.data().idcombo;
              const comboSnap = await getDoc(doc(db, 'combo', comboRef));
              return {
                id: docs.id,
                ...docs.data(),
                comboData: comboSnap.data(),
              };
            });

            const cartItems = await Promise.all(cartItemsPromises);

            setCart(cartItems);
            const total = cartItems.reduce(
              (sum, item) =>
                sum + parseFloat(item.comboData.price) * (item.quantity || 1),
              0,
            );
            setTotalPrice(total);
          });
        }
      } catch (error) {
        console.log('Error setting up real-time cart:', error);
      }
    };

    setupRealtimeCart();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const removeProductCart = async (id) => {
    try {
      await deleteDoc(doc(db, 'carrito', id))
        .then(() => {
        })
        .catch(error => {
        });
    } catch (error) {
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, {opacity: headerOpacity}]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}>
          <Icons name="arrow-left" sizes={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Carrito</Text>
        <View style={styles.headerButton} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}>
        <View style={styles.content}>
          {cart.length > 0 ? (
            <View style={styles.cartContent}>
              {/* Cart items would go here */}
              <Text style={styles.sectionTitle}>Productos en tu carrito</Text>
              {/* Add your cart items list here */}
              <ScrollView>
                {cart.map((item, index) => (
                  <View key={index} style={styles.cartItem}>
                    <Image
                      source={{uri: item.comboData.url}}
                      style={styles.imgProduc}
                    />
                    <TouchableOpacity onPress={()=>removeProductCart(item.id)}>
                      <Icons name="trash" sizes={25} />
                    </TouchableOpacity>
                    <Text style={styles.titleProductCart}>
                      {item.comboData.nameCombo}
                    </Text>
                    <Text style={styles.pricesProduct}>
                      ${item.comboData.price}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : (
            <Animated.View
              style={[
                styles.emptyCartContainer,
                {transform: [{scale: emptyCartScale}]},
              ]}>
              <ShoppingCart
                width={120}
                height={120}
                color={COLORS.lightGray}
                style={styles.emptyCartIcon}
              />
              <Text style={styles.emptyCartTitle}>Tu carrito está vacío</Text>
              <Text style={styles.emptyCartSubtitle}>
                ¡Agrega algunos productos increíbles!
              </Text>
              <TouchableOpacity
                style={styles.continueShoppingButton}
                onPress={() => navigation.navigate('Home')}>
                <Text style={styles.continueShoppingText}>
                  Continuar Comprando
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </ScrollView>

      {cart.length > 0 && (
        <View style={styles.bottomContainer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${totalPrice}</Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate('Checkout')}>
            <Text style={styles.checkoutButtonText}>Proceder al pago</Text>
          </TouchableOpacity>

          <BannerAd
            unitId="ca-app-pub-3477493054350988/1457774401"
            size={BannerAdSize.ADAPTIVE_BANNER}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  headerButton: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.gray,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cartContent: {
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyCartIcon: {
    marginBottom: 24,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 32,
    textAlign: 'center',
  },
  continueShoppingButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  continueShoppingText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
  imgProduc: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  titleProductCart: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: -10,
  },
  priceProduct: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});

export default CartScreen;
