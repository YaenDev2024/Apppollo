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

export const PackList = ({
  url,
  nameCombo,
  pechuga,
  papas,
  ranch,
  soda,
  zanahoria,
  apio,
}) => {
  // create new orden
  const handleNewOrder = () => {
    setEditActive(true);
  };

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

  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cardPack} onPress={handleNewOrder}>
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
            <Text style={styles.titleCard}>Orden #00001</Text>
            <TouchableWithoutFeedback onPress={handleClose}>
              <View style={styles.closeButton}>
                <Icons name={'times'} sizes={25} />
              </View>
            </TouchableWithoutFeedback>

            <View style={styles.containerAdd}>
              <Text style={styles.crearOrder}>Crear nueva orden: </Text>
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
              <TouchableOpacity style={styles.btncrear}>
                <Text>Crear</Text>
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
    left: 290,
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
});
