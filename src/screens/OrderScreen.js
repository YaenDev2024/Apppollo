import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {NavBar} from '../components/NavBar';

import order from '../../Assets/ordendecompra.png';
import {collection, onSnapshot, query} from 'firebase/firestore';
import {db} from '../../config';
import {BannerAd, BannerAdSize} from '@react-native-admob/admob';
import OrderList from './Orders/OrderList';
import GenerateTickets from '../components/GenerateTickets';

export const OrderScreen = () => {
  // get all orders
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'orders'));
        const unsuscribe = onSnapshot(q, querySnapshot => {
          const updatedProducts = [];
          querySnapshot.forEach(doc => {
            updatedProducts.push({id: doc.id, ...doc.data()});
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
    product.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Ordenar productos: primero los que tienen closed == 0, luego closed == 1
  const sortedProducts = filteredProducts.sort((a, b) => a.closed - b.closed);


  const generateAndSharePDF = async () => {
    if (!selectedProduct) {
      alert('Seleccione una orden primero.');
      return;
    }

    const generateTicketsComponent = <GenerateTickets productsss={selectedProduct} />;
    const htmlContent = generateTicketsComponent.type({ productsss: selectedProduct }).props.children.props.children.map(child => child.props.children).join('');

    const options = {
      html: htmlContent,
      fileName: 'OrderTicket',
      directory: 'Documents',
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      console.log(file.filePath);
      const shareOptions = {
        title: 'Compartir Orden',
        url: `file://${file.filePath}`,
        type: 'application/pdf',
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.error(error);
    }
  };




  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ImageBackground
        source={require('../../Assets/fondo.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={{opacity: 0.08}}>
        <View style={styles.container}>
          <StatusBar backgroundColor={'transparent'} barStyle="light-content" />
          <View style={styles.containerFlatlist}>
            <NavBar name={'Ordenes'} />
            <BannerAd
            unitId="ca-app-pub-3477493054350988/1457774401"
            size={BannerAdSize.ADAPTIVE_BANNER}
          />
            {loading ? (
              <ActivityIndicator size="large" color="black" />
            ) : (
              <View style={styles.containerProducts}>
                <FlatList
                data={sortedProducts}
                renderItem={({ item }) => (
                  <OrderList
                    id={item.id}
                    name={item.item[0].item + '...'}
                    url={order}
                    isClosed={item.closed}
                    dataToTicket = {item}
                    onPress={setSelectedProduct}
                  /> 
                )}
                keyExtractor={item => item.id.toString()}
              />
              </View>
            )}
            <Button title="Generar y Compartir PDF" onPress={generateAndSharePDF} />
          </View>
          
          <BannerAd
            unitId="ca-app-pub-3477493054350988/1457774401"
            size={BannerAdSize.ADAPTIVE_BANNER}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  containerFlatlist:{
      flex:1,
      width:'100%'
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
    flex:1,
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
