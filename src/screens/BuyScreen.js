import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NavBar} from '../components/NavBar';
import {PackList} from './buy/PackList';
import {db} from '../../config';
import {collection, onSnapshot, query} from 'firebase/firestore';
import GenerateTickets from '../components/GenerateTickets';

export const BuyScreen = () => {
  //get all combos
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredProducts = products.filter(product =>
    product.nameCombo.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const chunkedProducts = filteredProducts.reduce(
    (resultArray, item, index) => {
      const chunkIndex = Math.floor(index / 3);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }
      resultArray[chunkIndex].push(item);
      return resultArray;
    },
    [],
  );
  return (
    <View style={{backgroundColor: 'white', width: '100%', height: '100%'}}>
      <ImageBackground
        source={require('../../Assets/fondo.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={{opacity: 0.08}}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <StatusBar
            backgroundColor={'transparent'}
            barStyle="light-contentz"
          />
          <View style={styles.container}>
            <NavBar name={'Compras'} />
            <View>
              <Text style={styles.title}>Paquetes disponibles para venta</Text>
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="black" /> // Muestra el indicador de carga mientras los datos se están cargando
            ) : (
              <View style={styles.containerProducts}>
                {chunkedProducts.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.row}>
                    {row.map(product => (
                      <PackList
                        key={product.id}
                        url={product.url}
                        nameCombo={product.nameCombo}
                        apio={product.apio}
                        papas={product.papas}
                        pechuga={product.pechuga}
                        ranch={product.ranch}
                        soda={product.soda}
                        zanahoria={product.zanahoria}
                        price={product.price}
                      />
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
          {/* <GenerateTickets/> */}
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'start',
  },
  navbar: {
    backgroundColor: 'white',
    width: '100%',
    height: '7%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    marginLeft: 20,
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});
