import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator, // Importa el componente ActivityIndicator
} from 'react-native';
import {NavBar} from '../../components/NavBar';
import {SearchInput} from '../../components/SearchInput';
import {ButtonsInventory} from '../../components/ButtonsInventory';
import {ProductsList} from '../../components/ProductsList';
import {collection, query, where, onSnapshot} from 'firebase/firestore';
import {db} from '../../../config';

export const MainPageInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'food'));
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

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const chunkedProducts = filteredProducts.reduce(
    (resultArray, item, index) => {
      const chunkIndex = Math.floor(index / 2);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }
      resultArray[chunkIndex].push(item);
      return resultArray;
    },
    [],
  );

  return (
    <ImageBackground
      source={require('../../../Assets/fondo.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
      imageStyle={{opacity: 0.08}}>
      <StatusBar backgroundColor={'transparent'} barStyle="light-contentz" />
      <ScrollView contentContainerStyle={styles.container}>
        <NavBar name={'Inventario'} />
        <View>
          <SearchInput setSearchTerm={setSearchTerm} />
          <ButtonsInventory />
          {loading ? (
            <ActivityIndicator size="large" color="black" /> // Muestra el indicador de carga mientras los datos se están cargando
          ) : (
            <View style={styles.containerProducts}>
              {chunkedProducts.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {row.map(product => (
                    <ProductsList
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      url={product.url}
                      lastqty={product.lastqtyadded}
                      lastsize={product.lastsizeadded}
                      qty={product.qty}
                      size={product.size}
                    />
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  containerProducts: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});
