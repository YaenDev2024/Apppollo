import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icons from '../../components/Icons';
import {db} from '../../../config';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  getDocs,
} from 'firebase/firestore';

export const PackList = ({
  url,
  nameCombo,
  pechuga,
  papas,
  ranch,
  soda,
  zanahoria,
  apio,
  price,
  haveordercreated,
  orderNo,
  idorder,
}) => {
  const [orders, setOrders] = useState('');
  const [combosOrder, setCombosOrder] = useState([]);
  const [isCompleted, setCompleted] = useState(false);
  const [haveCombo, setHaveCombo] = useState(false);
  const [lastCombo, setLastCombo] = useState([]);
  // create new orden
  const handleNewOrder = () => {

    const fetchData = async () => {
      try {
        const q = query(collection(db, 'orders'));
        const unsuscribe = onSnapshot(q, querySnapshot => {
          //let highestOrderId = '0000';
          const updatedProducts = [];
          querySnapshot.forEach(doc => {
            const close = doc.data().closed;
            if (close === '0') {
              updatedProducts.push(doc.id);
            }
          });
          setCombosOrder(updatedProducts);
          // console.log(combosOrder)
        });
        return unsuscribe;
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    fetchData();
    setEditActive(true);
    getlastcombo();

  };

  const [order, setOrder] = useState('');
  const [qty, setQty] = useState(1);
  const [editActive, setEditActive] = useState(false);

  const handleSum = () => {
    setQty(qty + 1);
  };

  const handleRest = () => {
    if (qty === 1) {
    } else {
      setQty(qty - 1);
    }
  };

  const handleClose = () => {
    setEditActive(false);
  };

  
  const getlastcombo = async () => {
    if (lastCombo.length < 1) {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      querySnapshot.forEach(doc => {
        if (doc.id === orderNo) {
          const itemObtained = [];
          itemObtained.push(doc.data());
          setLastCombo(itemObtained);
        }
      });
    }
  };

  const updateFields = async () => {
   
    if (lastCombo[0].item != undefined && lastCombo[0].item != []) {
      const updateProduct = doc(db, 'orders', orderNo);

      const newCombo = {item: nameCombo, price: price, qty: qty};

      const lastDataCombo = {
        item: lastCombo[0].item,
        price: lastCombo[0].price,
        qty: lastCombo[0].qty,
      };

      let ArrayCombos = [];

      lastCombo[0].item.forEach(element => {
        ArrayCombos.push(element);
      });
      ArrayCombos.push(newCombo);

      let sumPrice = 0;
      let sumQty = 0;

      ArrayCombos.forEach(element => {
        sumPrice = sumPrice + (parseFloat(element.price) * parseFloat(element.qty));
        sumQty = sumQty + parseFloat(element.qty);
      });

      await updateDoc(updateProduct, {
        item: ArrayCombos,
        price: sumPrice,
        qty: sumQty,
        closed: '0',
      });

      ArrayCombos = [];
      setLastCombo([]);
    } else {
      const updateProduct = doc(db, 'orders', orderNo);
      const comboArray = [{item: nameCombo, price: price, qty: qty}];

      let priceSum = 0;
      priceSum = parseFloat(price) * parseFloat(qty);
      await updateDoc(updateProduct, {
        item: comboArray,
        price: priceSum,
        qty: qty,
        closed: '0',
      });

      
    }
  };

  const handleCreateOrder = () => {
    updateFields();
    setEditActive(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[haveordercreated ? styles.cardPack : styles.inactive]}
        onPress={handleNewOrder}
        disabled={!haveordercreated}>
        <Image style={styles.img} source={{uri: url}} />
        <Text style={styles.title}>{nameCombo}</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={editActive}
        onRequestClose={handleClose}>
        <View style={styles.modalBackground}>
          <View style={styles.card}>
            <Text style={styles.titleCard}>Orden {orderNo}</Text>
            <TouchableWithoutFeedback onPress={handleClose}>
              <View style={styles.closeButton}>
                <Icons name={'times'} sizes={25} />
              </View>
            </TouchableWithoutFeedback>

            <View style={styles.containerAdd}>
              <Text style={styles.crearOrder}>Agregar combo: </Text>
              <TouchableOpacity onPress={handleRest}>
                <Text>
                  <Icons name={'minus'} sizes={20} />
                </Text>
              </TouchableOpacity>
              <Text style={styles.titleQty}>{qty}</Text>

              <TouchableOpacity onPress={handleSum}>
                <Text>
                  <Icons name={'plus'} sizes={20} />
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.containerbtns}>
              <TouchableOpacity
                style={styles.btncrear}
                onPress={handleCreateOrder}>
                <Text>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  containerbtns: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btncancel: {
    backgroundColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
  },
  btncrear: {
    backgroundColor: '#E18911',
    padding: 10,
    borderRadius: 5,
    color: 'white',
  },
  container: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  title: {
    color: 'black',
    margin: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cardPack: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    width: 150,
    height: 150,
    borderRadius: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // opacity:0.5
  },
  img: {
    width: '103%',
    height: '80%',
    resizeMode: 'cover',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  card: {
    width: '80%',
    height: '20%',
    backgroundColor: 'white',
    padding: 20,
    marginTop: 220,
    borderRadius: 30,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  titleCard: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  crearOrder: {
    fontWeight: 'bold',
    color: 'black',
  },
  containerAdd: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  titleQty: {
    color: 'black',
    paddingRight: 10,
    paddingLeft: 10,
  },
  active: {
    // estilos cuando está activo
  },
  inactive: {
    opacity: 0.5, // por ejemplo, puedes ajustar la opacidad
    borderWidth: 1,
    borderColor: '#D5D5D5',
    width: 150,
    height: 150,
    borderRadius: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
