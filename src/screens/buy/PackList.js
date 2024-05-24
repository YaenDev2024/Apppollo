import React, {useState} from 'react';
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
  haveordercreated
}) => {
  const [orders, setOrders] = useState('');
  const [combosOrder, setCombosOrder] = useState([]);
  const [isCompleted, setCompleted] = useState(false);
  const [haveCombo, setHaveCombo] = useState(false)
  // create new orden
  const handleNewOrder = () => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'orders'));
        const unsuscribe = onSnapshot(q, querySnapshot => {
          //let highestOrderId = '0000';
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
          setOrders(maxIdString);
        });
        return unsuscribe;
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    fetchData();
    setEditActive(true);
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

  const handleCreateOrder = () => {
    if (!isCompleted) {
    const addNewCombo = {item: nameCombo, price: price, qty: qty, closed: '0'}
        setCombosOrder(prevCombos => [...prevCombos, addNewCombo])
        setHaveCombo(true)
        console.log(combosOrder)
    } else {
      setDoc(doc(db, 'orders', orders), {
        item: nameCombo,
        price: price,
        qty: qty,
        closed: '0',
      });
      setEditActive(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity  style={[ haveordercreated ? styles.cardPack : styles.inactive]} onPress={handleNewOrder}  disabled={!haveordercreated}>
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
            <Text style={styles.titleCard}>Orden #{orders}</Text>
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
                <Text>Crear</Text>
              </TouchableOpacity>
              {haveCombo ?  <TouchableOpacity
                style={styles.btncrear}
                onPress={handleCreateOrder}>
                <Text>Terminar</Text>
              </TouchableOpacity>: ''}
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
    width: 180,
    height: 200,
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
    width: 180,
    height: 200,
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
