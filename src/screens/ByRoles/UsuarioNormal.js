import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { ShoppingBag } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BannerAd, BannerAdSize, useRewardedAd } from '@react-native-admob/admob';
import { auth, db } from '../../../config';
import Icons from '../../components/Icons';
import SearchInput from '../../components/SearchInput';
import ModalPerfilUser from '../../components/ModalPerfilUser';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#FF4B3E',
  secondary: '#2A2A2A',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textLight: '#757575',
  accent: '#FFD23F',
};

const ProductCard = ({ product, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: product.url }} style={styles.cardImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.cardGradient}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {product.nameCombo}
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.ratingContainer}>
              <Icons name="star" sizes={12} color="#FFD700" />
              <Text style={styles.rating}>{product.star}</Text>
            </View>
            <Text style={styles.price}>${product.price}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const PromoCard = ({ product }) => {
  return (
    <TouchableOpacity style={styles.promoCard} activeOpacity={0.9}>
      <Image source={{ uri: product.url }} style={styles.promoImage} />
      <View style={styles.promoContent}>
        <View style={styles.promoBadge}>
          <Text style={styles.promoLabel}>Próximamente</Text>
        </View>
        <Text style={styles.promoTitle}>{product.nameCombo}</Text>
      </View>
    </TouchableOpacity>
  );
};

const SectionHeader = ({ title, onSeeAll }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <TouchableOpacity onPress={onSeeAll}>
      <Text style={styles.seeAllButton}>Ver Todo</Text>
    </TouchableOpacity>
  </View>
);

const UsuarioNormal = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [badgeNum, setBadgeNum] = useState(0);
  const signedInUser = auth.currentUser;
  const navigation = useNavigation();
  const scrollY = new Animated.Value(0);

  const { adLoaded, adDismissed, show } = useRewardedAd(
    'ca-app-pub-3477493054350988/8242528814',
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'combo'));
        const unsuscribe = onSnapshot(q, querySnapshot => {
          const updatedProducts = [];
          querySnapshot.forEach(doc => {
            updatedProducts.push({ id: doc.id, ...doc.data() });
          });
          setProducts(updatedProducts);
          setLoading(false);
        });
        return unsuscribe;
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    fetchData();
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const renderPopularProducts = () => {
    return products
      .filter(product => product.nameCombo !== 'Coming soon')
      .map((product, index) => (
        <ProductCard
          key={index}
          product={product}
          onPress={() =>
            navigation.navigate('ProductDescBuy', {
              product: product,
            })
          }
        />
      ));
  };

  const renderPromotions = () => {
    return products
      .filter(product => product.nameCombo === 'Coming soon')
      .map((product, index) => (
        <PromoCard key={index} product={product} />
      ));
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <Text style={styles.headerTitle}>Descubre</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('CartScreen')}
          >
            <ShoppingBag size={24} color={COLORS.text} />
            {badgeNum > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badgeNum}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => setIsVisible(true)}
          >
            <Image
              style={styles.avatar}
              source={{ uri: signedInUser.photoURL }}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {isVisible && <ModalPerfilUser onClose={() => setIsVisible(false)} visible={isVisible} />}

      <SearchInput />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <SectionHeader
            title="Productos Populares"
            onSeeAll={() => {}}
          />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsScroll}
          >
            {loading ? (
              <Text style={styles.loadingText}>Cargando...</Text>
            ) : (
              renderPopularProducts()
            )}
          </ScrollView>

          <SectionHeader
            title="Promociones"
            onSeeAll={() => {}}
          />
          <View style={styles.promotionsContainer}>
            {loading ? (
              <Text style={styles.loadingText}>Cargando...</Text>
            ) : (
              renderPromotions()
            )}
          </View>

          <SectionHeader
            title="Gana productos gratis"
            onSeeAll={() => {}}
          />
          <View style={styles.freeProductsContainer}>
            {loading ? (
              <Text style={styles.loadingText}>Cargando...</Text>
            ) : (
              renderPromotions()
            )}
          </View>
        </View>
      </Animated.ScrollView>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  avatarContainer: {
    padding: 2,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  productsScroll: {
    paddingBottom: 16,
    gap: 16,
  },
  card: {
    width: width * 0.6,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  cardContent: {
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.surface,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.surface,
  },
  promotionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  promoCard: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
  promoContent: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
  },
  promoBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  promoLabel: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.surface,
  },
  freeProductsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    padding: 20,
  },
});

export default UsuarioNormal;