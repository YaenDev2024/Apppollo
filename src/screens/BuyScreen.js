import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NavBar} from '../components/NavBar';
import {PackList} from './buy/PackList';
import {db} from '../../config';
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {ModalOrdersToSelect} from '../components/BuyScreenComponents/ModalOrdersToSelect';
import {BannerAd, BannerAdSize} from '@react-native-admob/admob';

export const BuyScreen = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState(false);
  const [lastOrder, setLastorders] = useState('');
  const [orderActive, setOrderActive] = useState('none');
  const [ModalSelectOrder, setShowModalSelectOrder] = useState(false);
  const [inactiveBtn,setInactiveBtn] = useState(false);
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

    const fetchDataOrder = async () => {
      try {
        const q = query(collection(db, 'orders'));
        const unsuscribe = onSnapshot(q, querySnapshot => {
          const updatedProducts = [];
          querySnapshot.forEach(doc => {
            updatedProducts.push(doc.id);
          });
          const maxId = updatedProducts.reduce((max, id) => {
            const numericId = parseInt(id, 10);
            return numericId > max ? numericId : max;
          }, 0);
          let sum = maxId + 1;
          const maxIdString = sum.toString().padStart(4, '0');
          setLastorders(maxIdString);
        });
        return unsuscribe;
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchDataOrder();

    if(orderActive === 'none')
      {
        setInactiveBtn(true);
      }

  }, []);

  const filteredProducts = products.filter(product =>
    product.nameCombo.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const createOrder = () => {
    setDoc(doc(db, 'orders', lastOrder), {
      item: [],
      price: '',
      qty: '',
      closed: '0',
    });
  };

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

  const handleCreateOrder = () => {
    setOrder(true);
    setInactiveBtn(false);
    setOrderActive(lastOrder);
    createOrder();
  };

  const handleSelectOrder = () => {
    setShowModalSelectOrder(true);
  };

  const handleEndOrder = async () => {
    const updateProduct = doc(db, 'orders', orderActive);

    await updateDoc(updateProduct, {
      closed: '1',
    });

    setOrderActive('none');
    setInactiveBtn(true);
    setOrder(false);
  };

  const handleCloseModal = () => {
    setShowModalSelectOrder(false);
  };

  const getDataModal = text => {
    console.log(text);
    setShowModalSelectOrder(false);
    setOrderActive(text);
    setOrder(true);
    setInactiveBtn(false)
  };
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
            <View style={styles.containerOrder}>
              <Text style={styles.title}>Paquetes disponibles para venta</Text>
              <Text style={styles.title}>Orden Activa: #{orderActive}</Text>
              <View style={styles.rowbtns}>
                <TouchableOpacity
                  style={styles.selectorder}
                  onPress={handleSelectOrder}>
                  <Text style={styles.titleorderselect}>Seleccionar Order</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[!inactiveBtn ? styles.endorder : styles.inactive]}
                  onPress={handleEndOrder}
                  disabled={inactiveBtn}>
                  <Text style={styles.titleorderselect}>Terminar Order</Text>
                </TouchableOpacity>
             
              </View>
              <BannerAd
            unitId="ca-app-pub-3477493054350988/1457774401"
            size={BannerAdSize.ADAPTIVE_BANNER}
          />
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="black" />
            ) : (
              <View>
                {chunkedProducts.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.row}>
                    {row.map(product => (
                      <PackList
                        key={product.id}
                        idorder={product.id}
                        url={product.url}
                        nameCombo={product.nameCombo}
                        apio={product.apio}
                        papas={product.papas}
                        pechuga={product.pechuga}
                        ranch={product.ranch}
                        soda={product.soda}
                        zanahoria={product.zanahoria}
                        price={product.price}
                        haveordercreated={order}
                        orderNo={orderActive}
                      />
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
          <ModalOrdersToSelect
            isActive={ModalSelectOrder}
            onClose={handleCloseModal}
            data={getDataModal}
          />
          <TouchableOpacity style={styles.btncrear} onPress={handleCreateOrder}>
            <Text style={styles.titlebtn}>Crear orden</Text>
          </TouchableOpacity>
          <BannerAd
            unitId="ca-app-pub-3477493054350988/1457774401"
            size={BannerAdSize.FULL_BANNER}
          />
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
  containerOrder: {
    alignItems: 'center',
    justifyContent: 'start',
  },
  btncrear: {
    backgroundColor: 'orange',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlebtn: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
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
    paddingHorizontal: 0,
  },
  titleorderselect: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectorder: {
    backgroundColor: '#B67F51',
    padding: 10,
    borderRadius: 5,
    margin: 1,
  },
  endorder: {
    backgroundColor: '#B66051',
    padding: 10,
    borderRadius: 5,
    margin: 1,
  },
  inactive: {
    backgroundColor: '#B66051',
    padding: 10,
    borderRadius: 5,
    margin: 1,
    opacity:0.5
  },
  rowbtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
