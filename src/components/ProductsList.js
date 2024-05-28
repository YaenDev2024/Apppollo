import React, {useState} from 'react';
import {
  Alert,
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icons from './Icons';
import ProgressBar from 'react-native-progress/Bar';
import {doc, updateDoc} from 'firebase/firestore';
import {db} from '../../config';

export const ProductsList = ({name, url, lastqty, lastsize, size, qty, id}) => {
  const [active, setActive] = useState(false);
  const [editActive, setEditActive] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedCantidad, setEditedCantidad] = useState('');
  const [editedPeso, setEditedPeso] = useState('');

  const calculateProgress = () => {
    return qty / lastqty;
  };
  const calculateprogressqty = () => {
    return size / lastsize;
  };
  const handleClose = () => {
    setActive(false);
  };
  const handleEditClose = () => {
    setEditActive(false);
  };

  const handleEditOpen = () => {
    setEditActive(true);
  };

  const handleNameEdited = text => {
    setEditedName(text);
  };
  const handleQtyEdited = text => {
    setEditedCantidad(text);
  };
  const hanldeSizeEdited = text => {
    setEditedPeso(text);
  };

  const updateFields = async () => {
    const updateProduct = doc(db, 'food', id);

    await updateDoc(updateProduct, {
      lastqtyadded: editedCantidad,
      lastsizeadded: editedPeso,
      name: editedName,
      size: editedPeso,
      qty: editedCantidad,
    });
  };
  return (
    <>
      {/* Card del producto  */}
      <TouchableOpacity
        style={styles.cardProduct}
        onPress={() => setActive(true)}>
        <Image style={styles.img} source={{uri: url}} />
        <Text style={styles.titleProduct}>{name}</Text>
      </TouchableOpacity>
      {/* Modal para ver los datos de cada producto individual */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={active}
        onRequestClose={handleClose}>
        <View style={styles.centeredView}>
          <View style={styles.card}>
            <Text style={styles.titleCard}>{name}</Text>
            <TouchableWithoutFeedback onPress={handleClose}>
              <View style={styles.closeButton}>
                <Icons name={'times'} sizes={25} />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={handleEditOpen}>
              <View style={styles.editbtn}>
                <Icons name={'pencil'} sizes={25} />
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.rowContainer}>
              <Image style={styles.imgModal} source={{uri: url}} />
            </View>
            <View style={styles.rowContainerProgress}>
              <Text style={styles.title}>
                Cantidad: {qty}/{lastqty} piezas
              </Text>

              <ProgressBar
                progress={calculateProgress()}
                width={280}
                height={30}
                color={'#76c7c0'}
                unfilledColor={'#D3D3D3'}
                borderWidth={0}
                borderColor={'#000'}
              />
            </View>
            <View style={styles.rowContainerProgress}>
              <Text style={styles.title}>
                Peso: {size}/{lastsize} Kg
              </Text>

              <ProgressBar
                progress={calculateprogressqty()}
                width={280}
                height={30}
                color={'#76c7c0'}
                unfilledColor={'#D3D3D3'}
                borderWidth={0}
                borderColor={'#000'}
              />
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal para editar cada producto individual */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={editActive}
        onRequestClose={handleEditClose}>
        <View style={styles.centeredView}>
          <View style={styles.card}>
            <Text style={styles.titleCard}>Editar Producto</Text>
            <TouchableWithoutFeedback onPress={handleEditClose}>
              <View style={styles.closeButton}>
                <Icons name={'times'} sizes={25} />
              </View>
            </TouchableWithoutFeedback>
            <Text style={styles.title}>Nombre:</Text>
            <TextInput
              placeholder={name}
              style={styles.input}
              textAlign="center"
              onChangeText={handleNameEdited}
              placeholderTextColor="gray"
            />
            <Text style={styles.title}>Cantidad:</Text>
            <TextInput
              placeholder={qty}
              style={styles.input}
              textAlign="center"
              onChangeText={handleQtyEdited}
              placeholderTextColor="gray"
            />
            <Text style={styles.title}>Peso:</Text>
            <TextInput
              placeholder={size}
              style={styles.input}
              textAlign="center"
              onChangeText={hanldeSizeEdited}
              placeholderTextColor="gray"
            />
            <TouchableOpacity
              style={styles.btnAdd}
              title="Editar"
              onPress={updateFields}>
              <Text style={styles.titlebtn}>Guardar cambios</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  cardProduct: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#D5D5D5',
    width: 150,
    height: 120,
    margin: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleProduct: {
    color: 'black',
    margin: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  img: {
    width: '100%',
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
    borderWidth: 1,
    borderColor: '#D5D5D5',
  },
  imgModal: {
    width: '80%',
    height: 250,
    borderRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  card: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    flexDirection: 'column',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    width: 250,
    height: 50,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    color: 'black',
  },
  titleCard: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    padding: 15,
  },
  btnAdd: {
    backgroundColor: '#E18911',
    padding: 18,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlebtn: {
    color: 'white',
    fontSize: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  editbtn: {
    position: 'absolute',
    top: 20,
    right: 300,
  },
  success: {
    backgroundColor: 'green',
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 100,
  },
  select: {
    backgroundColor: 'black',
  },
  title:{
    color:'black'
  }
});

export default ProductsList;
