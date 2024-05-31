import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GenerateTickets from '../../components/GenerateTickets';

export const OrderList = ({ name, url, isClosed, id, dataToTicket, onPress }) => {
  const [showModal, setShowModal] = useState(false);
  
  const handleLoadTicket = () => {
    setShowModal(true);
    onPress(dataToTicket); // Asegúrate de llamar a onPress aquí con el producto
  };

  return (
    <View style={styles.container}>
      
      
     
      <TouchableOpacity style={isClosed === "0" ? styles.cardDisabled : styles.card} onPress={handleLoadTicket} disabled={isClosed === "0"}>
        <Image style={styles.img} source={url} />
        <View style={styles.textContainer}>
          <Text style={styles.textColor}>{name}</Text>
          <Text style={styles.textColor}>#{id}</Text>
          {isClosed === "0" ? (
            <Text style={styles.textColorActive}></Text>
          ) : (
            <Text style={styles.textColorSell}>{isClosed}</Text>
          )}
        </View>
      </TouchableOpacity>

      
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <GenerateTickets productsss={dataToTicket} />
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    width: '95%',
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    margin: 10,
    borderRadius: 10,
    padding: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  cardDisabled: {
    backgroundColor: 'white',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    width: '95%',
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    margin: 10,
    borderRadius: 10,
    padding: 10,
    opacity:0.5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
  textColor: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textColorActive: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'red',
    borderRadius: 100,
    width: 25,
    height: 25,
    textAlign: 'center',
  },
  textColorSell: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'green',
    borderRadius: 100,
    width: 25,
    height: 25,
    textAlign: 'center',
  },
  img: {
    width: 90,
    height: 90,
    borderRadius: 10,
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
  },
  closeButton: {
    marginTop: 10,
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderList;
