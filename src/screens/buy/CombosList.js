import {BannerAd, BannerAdSize} from '@react-native-admob/admob';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {NavBar} from '../../components/NavBar';
import {addDoc, collection, onSnapshot, query} from 'firebase/firestore';
import {db} from '../../../config';
import SearchInput from '../../components/SearchInput';
import {TextInput} from 'react-native-gesture-handler';

const CombosList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [qty, setQty] = useState(0);
  const [comboReady, setComboReady] = useState(false);
  const [comboPrepared, setComboPrepared] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    setComboReady(qty > 0);
  }, [qty]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handlePressProduct = item => {
    setComboPrepared(prevState => {
      const updatedComboPrepared = [...prevState, item];
      setQty(updatedComboPrepared.length);
      return updatedComboPrepared;
    });

    setProducts(prevProducts =>
      prevProducts.filter(product => product.id !== item.id),
    );
  };

  const handleQuitProduct = () => {
    if (comboPrepared.length > 0) {
      const lastItem = comboPrepared[comboPrepared.length - 1];
      setComboPrepared(prevState => {
        const updatedComboPrepared = prevState.slice(0, -1);
        setQty(updatedComboPrepared.length);
        return updatedComboPrepared;
      });

      setProducts(prevProducts => [...prevProducts, lastItem]);
    }
  };

  const handleCreateCombo = () => {
    setShowModal(true);
  };

  const addFoodDocument = async id => {
    try {
      const docRef = await addDoc(collection(db, 'combo'), {
        idcombo: name,
        qty: qty,
        size: size,
        url: downloadURL,
        lastqtyadded: qty,
        lastsizeadded: size,
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (err) {
      console.error('Error adding document: ', err);
    }
  };

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../../../Assets/fondo.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={{opacity: 0.08}}>
        <StatusBar backgroundColor={'transparent'} barStyle="light-content" />
        <NavBar name={'Crear Combos'} />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <BannerAd
              unitId="ca-app-pub-3477493054350988/1457774401"
              size={BannerAdSize.ADAPTIVE_BANNER}
            />
            <Text style={styles.title}>Lista de Productos disponibles</Text>
            <SearchInput setSearchTerm={setSearchTerm} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={comboReady ? styles.btncrear : styles.btncreardisabled}
                disabled={!comboReady}
                onPress={handleCreateCombo}>
                <Text style={styles.textbtncrear}>Crear combo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={qty === 0 ? styles.btnquitardisabled : styles.btnquitar}
                disabled={qty === 0}
                onPress={handleQuitProduct}>
                <Text style={styles.textbtncrear}>Quitar Productos</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>Productos agregados: {qty}</Text>
            <View style={styles.menuContainer}>
              {loading ? (
                <ActivityIndicator size="large" color="black" />
              ) : (
                filteredProducts.map(product => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.card}
                    onPress={() => handlePressProduct(product)}>
                    <Image style={styles.img} source={{uri: product.url}} />
                    <Text style={styles.textColor}>{product.name}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
            <BannerAd
              unitId="ca-app-pub-3477493054350988/1457774401"
              size={BannerAdSize.ADAPTIVE_BANNER}
            />
          </View>
          <Modal visible={showModal} animationType="fade" transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.title}>Crear Combo</Text>
                <ScrollView contentContainerStyle={styles.modalScrollContent}>
                  {comboPrepared.map(p => (
                    <View key={p.id} style={styles.containerInputs}>
                      <Text style={styles.textName}>{p.name}</Text>
                      <TextInput
                        placeholder='Cantidad que consumira ' 
                        placeholderTextColor={'gray'}
                        style={styles.inputDesign}
                      />
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.containerBtns}>
                  <TouchableOpacity onPress={() => setShowModal(false)}>
                    <Text style={styles.closeButton}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => addFoodDocument()}>
                    <Text style={styles.createButton}>Crear</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    maxHeight: '80%', // Limita la altura del modal
    width: '70%',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerInputs: {
    marginVertical: 10,
  },
  inputDesign: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    margin: 10,
    width: 200,
    borderRadius: 10,
  },
  containerBtns: {
    flexDirection: 'row',
  },
  textName: {
    color: 'black',
    fontWeight: '700',
  },
  closeButton: {
    marginTop: 10,
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
    margin: 10,
  },
  createButton: {
    marginTop: 10,
    color: 'orange',
    fontSize: 16,
    fontWeight: 'bold',
    margin: 10,
  },
  btncrear: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  btncreardisabled: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
    margin: 5,
    opacity: 0.5,
  },
  btnquitar: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  btnquitardisabled: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    margin: 5,
    opacity: 0.5,
  },
  textbtncrear: {
    color: 'white',
  },
  textColor: {
    color: 'black',
    padding: 20,
    margin: 15,
    fontWeight: 'bold',
    fontSize: 18,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  menuContainer: {
    width: '100%',
    marginVertical: 20,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    flexDirection: 'row',
  },
  navbar: {
    width: '100%',
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  img: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  card: {
    backgroundColor: 'white',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    width: '95%',
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 10,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default CombosList;
