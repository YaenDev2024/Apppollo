import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import Icons from '../../components/Icons';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../../config';
import { BannerAd, BannerAdSize } from '@react-native-admob/admob';
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

const { width } = Dimensions.get('window');

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

const MENU_ITEMS = [
  {
    icon: '📦',
    title: 'Mis Pedidos',
    route: 'UserPedidos',
  },
  {
    icon: '❤️',
    title: 'Favoritos',
    route: 'UserFav',
  },
  {
    icon: '🎁',
    title: 'Mis Puntos',
    route: 'UserPoints',
  },
  {
    icon: '📍',
    title: 'Direcciones',
    route: 'UserDir',
  },
];

const UserPerfil = () => {
  const navigation = useNavigation();
  const signedInUser = auth.currentUser;
  const scrollY = new Animated.Value(0);
  const [listPedidos, setListPedidos] = useState([]);
  const [listFav, setListFav] = useState([]);
  const [listPoints, setListPoints] = useState('');

  // Animations
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [1.2, 1, 0.8],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const getUserId = async () => {
      if (signedInUser) {
        const querySnapshot = await getDocs(
          query(
            collection(db, 'users'),
            where('mail', '==', signedInUser.email),
          ),
        );
        
        querySnapshot.forEach(doc => {
          const unsubscribe = onSnapshot(
            query(collection(db, 'pedidos'), where('iduser', '==', doc.id)),
            snapshot => {
              setListPedidos(
                snapshot.docs.map(docst => ({id: docst.id, ...docst.data()})),
              );
            },
          );
          
          const unsubscribeFav = onSnapshot(
            query(collection(db, 'favoritos'), where('iduser', '==', doc.id)),
            snapshot => {
              setListFav(
                snapshot.docs.map(doct => ({id: doct.id, ...doct.data()})),
              );
            },
          );
          
          setListPoints(doc.data().coins);
          return unsubscribe;
        });
      }
    };
    getUserId();
  }, [signedInUser]);

  const renderMenuItem = ({ icon, title, route }) => (
    <TouchableOpacity
      key={title}
      style={styles.menuItem}
      onPress={() => navigation.navigate(route)}>
      <View style={styles.menuIconContainer}>
        <Text style={styles.menuIcon}>{icon}</Text>
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Icons name="arrow-right" sizes={20} color={COLORS.textLight} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Floating Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}>
          <Icons name="arrow-left" sizes={22} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('ConfigUser')}>
          <Icons name="cog" sizes={22} color={COLORS.text} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Animated.View style={[styles.imageContainer, { transform: [{ scale: imageScale }] }]}>
            <Image
              style={styles.profileImage}
              source={{ uri: signedInUser.photoURL }}
            />
          </Animated.View>
          <Text style={styles.profileName}>{signedInUser.displayName}</Text>
          <Text style={styles.profileEmail}>{signedInUser.email}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{listPedidos.length}</Text>
            <Text style={styles.statLabel}>Pedidos</Text>
          </View>
          <View style={[styles.statCard, styles.statCardMiddle]}>
            <Text style={styles.statValue}>{listFav.length}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{listPoints}</Text>
            <Text style={styles.statLabel}>Puntos</Text>
          </View>
        </View>

        <BannerAd
          unitId="ca-app-pub-3477493054350988/1457774401"
          size={BannerAdSize.ADAPTIVE_BANNER}
        />

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {MENU_ITEMS.map(renderMenuItem)}
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
  profileSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  imageContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.background,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
  },
  profileEmail: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statCardMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.lightGray,
    paddingHorizontal: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.gray,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
});

export default UserPerfil;