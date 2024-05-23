import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { NavBar } from '../components/NavBar';
import { OrderList } from './Orders/OrderList';
import order from '../../Assets/ordendecompra.png';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../config';

export const OrderScreen = () => {
  // get all orders
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'orders'));
        const unsuscribe = onSnapshot(q, querySnapshot => {
          const updatedProducts = [];
          querySnapshot.forEach(doc => {
            updatedProducts.push({ id: doc.id, ...doc.data() });
          });
          console.log('Updated Products:', updatedProducts);
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

  // Filtrar productos según el término de búsqueda
  const filteredProducts = products.filter(product =>
    product.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar productos: primero los que tienen closed == 0, luego closed == 1
  const sortedProducts = filteredProducts.sort((a, b) => a.closed - b.closed);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ImageBackground
        source={require('../../Assets/fondo.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={{ opacity: 0.08 }}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <StatusBar
            backgroundColor={'transparent'}
            barStyle="light-content"
          />
          <View style={styles.container}>
            <NavBar name={'Ordenes'} />
            {loading ? (
              <ActivityIndicator size="large" color="black" />
            ) : (
              <View style={styles.containerProducts}>
                {sortedProducts.map(product => (
                  <OrderList
                    key={product.id}
                    id={product.id}
                    name={product.item}
                    url={order}
                    isClosed={product.closed}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start', // Asegura que el contenido comience desde la parte superior
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Asegura que el contenido comience desde la parte superior
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
  containerProducts: {
    width: '100%',
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default OrderScreen;
