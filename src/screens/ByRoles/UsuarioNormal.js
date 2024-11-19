import {collection, onSnapshot, query, where} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {auth, db} from '../../../config';
import {useNavigation} from '@react-navigation/native';
import ModalPerfilUser from '../../components/ModalPerfilUser';
import {BannerAd, BannerAdSize, useRewardedAd} from '@react-native-admob/admob';
import Icons from '../../components/Icons';
import SearchInput from '../../components/SearchInput';

const COLORS = {
  dark: 'black',
  darkSecondary: '#4A311F',
  primary: '#FFD23F',
  primaryLight: '#FFE584',
  accent: '#FF6B6B',
  background: 'white',
};

const UsuarioNormal = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const signedInUser = auth.currentUser;
  //console.log(signedInUser);
  const navigation = useNavigation();
  const {adLoaded, adDismissed, show} = useRewardedAd(
    'ca-app-pub-3477493054350988/8242528814',
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'combo'));
        const unsuscribe = onSnapshot(q, querySnapshot => {
          const updatedProducts = [];
          querySnapshot.forEach(doc => {
            updatedProducts.push({id: doc.id, ...doc.data()});
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

  useEffect(() => {
    if (signedInUser) {
      const fetchData = async () => {
        try {
          const q = query(
            collection(db, 'users'),
            where('mail', '==', signedInUser.email),
          );
          const unsubscribe = onSnapshot(q, querySnapshot => {
            querySnapshot.forEach(doc => {
              if (doc.exists) {
                //setRole(doc.data().role);
                console.log(doc.data());
              }
            });
          });
          return () => {
            unsubscribe();
          };
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
      };

      fetchData();
    }
  }, [signedInUser]);

  const renderCombos = () => {
    return products.map((product, index) => {
      return product.nameCombo === 'Coming soon' ? null : (
        <TouchableOpacity
          key={index}
          style={styles.cardProduct}
          onPress={() =>
            navigation.navigate('ProductDescBuy', {
              product: product,
            })
          }>
          <Image style={styles.imgProduct} source={{uri: product.url}} />
          <Text style={styles.titleProduct}>{product.nameCombo}</Text>
          <Text style={styles.calification}>⭐{product.star}</Text>
          <Text style={styles.price}>${product.price}</Text>
        </TouchableOpacity>
      );
    });
  };
  const renderCombosFree = () => {
    return products.map((product, index) => {
      return product.nameCombo === 'Coming soon' ? null : (
        <TouchableOpacity
          key={index}
          style={styles.cardProduct}
          onPress={() =>
            navigation.navigate('ProductDescBuy', {
              product: product,
            })
          }>
          <Image style={styles.imgProduct} source={{uri: product.url}} />
          <Text style={styles.titleProduct}>{product.nameCombo}</Text>
          <Text style={styles.calification}>⭐{product.star}</Text>
          <Text style={styles.price}>${product.price}</Text>
        </TouchableOpacity>
      );
    });
  };

  const renderPromos = () => {
    return products.map((product, index) => {
      return product.nameCombo !== 'Coming soon' ? null : (
        <TouchableOpacity key={index} style={styles.cardProductProm}>
          <Image style={styles.imgProduct} source={{uri: product.url}} />
          <Text style={styles.titleProduct}>{product.nameCombo}</Text>
        </TouchableOpacity>
      );
    });
  };

  const onClose = () => {
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle="dark-content"
      />

      <View style={styles.header}>
        <Text style={styles.title}>Descubre</Text>
        <TouchableOpacity onPress={() => setIsVisible(true)}>
          <Image
            style={styles.imgPerfil}
            source={{uri: signedInUser.photoURL}}
          />
        </TouchableOpacity>
      </View>
      {isVisible && <ModalPerfilUser onClose={onClose} visible={isVisible} />}

      {/* */}
      <SearchInput />
      <ScrollView>
        <View style={styles.productsPopularesContainer}>
          <Text style={styles.productsTitles}>Productos Populares</Text>
          <TouchableOpacity>
            <Text style={styles.seeall}>Ver Todo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerCards}>
          {loading ? <Text>Cargando...</Text> : renderCombos()}
        </View>

        <View style={styles.productsPopularesContainer}>
          <Text style={styles.productsTitles}>Promociones</Text>
          <TouchableOpacity>
            <Text style={styles.seeall}>Ver Todo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.containerCardsProm}>
          {loading ? <Text>Cargando...</Text> : renderPromos()}
        </View>
        <View style={styles.productsPopularesContainer}>
          <Text style={styles.productsTitles}>Gana productos gratis</Text>
          <TouchableOpacity>
            <Text style={styles.seeall}>Ver Todo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.containerCardsProm}>
          {loading ? <Text>Cargando...</Text> : renderPromos()}
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
    paddingTop: 60,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  imgPerfil: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    objectFit: 'cover',
  },
  searchinput: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 20,
    height: 60,
    placeholderTextColor: COLORS.darkSecondary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productsPopularesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  productsTitles: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  seeall: {
    fontSize: 16,
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  containerCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  cardProduct: {
    backgroundColor: 'white',
    padding: 15,
    margin: 8,
    borderRadius: 20,
    width: '45%', // Ajustado para que quepan 2 cards por fila con margen
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'flex-start',
  },
  imgProduct: {
    width: '100%',
    height: 120,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    marginBottom: 10,
    objectFit: 'cover',
  },
  titleProduct: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 5,
  },
  calification: {
    fontSize: 14,
    color: '#ffcd16',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  seeMoreButton: {
    fontSize: 16,
    color: COLORS.accent,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  containerCardsProm: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  cardProductProm: {
    backgroundColor: 'white',
    padding: 15,
    margin: 8,
    borderRadius: 20,
    width: '80%', // Ajustado para que quepan 2 cards por fila con margen
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'flex-start',
  },
});

export default UsuarioNormal;
