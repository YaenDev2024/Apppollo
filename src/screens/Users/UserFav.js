import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  FlatList,
  Dimensions,
} from 'react-native';
import Icons from '../../components/Icons';
import {useNavigation} from '@react-navigation/native';
import {auth, db} from '../../../config';
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

const {width} = Dimensions.get('window');

const COLORS = {
  dark: 'black',
  darkSecondary: '#4A311F',
  primary: '#FFD23F',
  primaryLight: '#FFE584',
  accent: '#FF6B6B',
  background: 'white',
  cardBackground: '#F5F5F5',
};

const UserFav = () => {
  const navigation = useNavigation();
  const [listCombosFav, setListCombosFav] = useState([]);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const signedInUser = auth.currentUser;
        if (!signedInUser) {
          console.log('No user signed in');
          setLoading(false);
          return;
        }

        // Obtener el ID del usuario
        const userQuery = query(
          collection(db, 'users'),
          where('mail', '==', signedInUser.email),
        );

        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userId = userDoc.id;

          // Obtener favoritos del usuario
          const favQuery = query(
            collection(db, 'favoritos'),
            where('iduser', '==', userId),
          );

          const unsubscribe = onSnapshot(favQuery, async favSnapshot => {
            // Obtener detalles completos de cada combo favorito
            const favoritesPromises = favSnapshot.docs.map(async favDoc => {
              const comboQuery = query(
                collection(db, 'combo'),
                where('__name__', '==', favDoc.data().idcombo),
              );

              const comboSnapshot = await getDocs(comboQuery);

              if (!comboSnapshot.empty) {
                const comboDoc = comboSnapshot.docs[0];

                return {
                  id: comboDoc.id,
                  ...comboDoc.data(),
                  favId: favDoc.id,
                };
              }
              return null;
            });

            // Filtrar resultados nulos y actualizar estado
            const favorites = (await Promise.all(favoritesPromises)).filter(
              item => item !== null,
            );

            setListCombosFav(favorites);
            setLoading(false);
          });

          // Retornar función de limpieza
          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const renderFavoriteItem = ({item}) => (
    <TouchableOpacity
      style={styles.cardFavorite}
      onPress={() =>
        navigation.navigate('ProductDescBuy', {
          product: item,
        })
      }>
      <Image source={{uri: item.url}} style={styles.favoriteImage} />
      <View style={styles.favoriteDetails}>
        <Text style={styles.favoriteTitle}>{item.nameCombo}</Text>
        <Text style={styles.favoritePrice}>${item.price}</Text>
      </View>
      <TouchableOpacity
        style={styles.favoriteIconContainer}
        // Implementar lógica para eliminar de favoritos
      >
        <Icons name="heart" sizes={25} color={COLORS.accent} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btnrounded}
          onPress={() => navigation.goBack()}>
          <Icons name="arrow-left" sizes={25} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favoritos</Text>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Cargando favoritos...</Text>
      ) : listCombosFav.length > 0 ? (
        <FlatList
          data={listCombosFav}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyStateText}>No tienes productos favoritos</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 40,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  btnrounded: {
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 90,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  cardFavorite: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  favoriteImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  favoriteDetails: {
    flex: 1,
  },
  favoriteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  favoritePrice: {
    fontSize: 16,
    color: COLORS.primary,
  },
  favoriteIconContainer: {
    padding: 10,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: COLORS.dark,
  },
  emptyStateText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
    color: COLORS.dark,
  },
});

export default UserFav;
