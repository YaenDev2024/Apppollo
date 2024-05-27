import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../../config';

export const ModalOrdersToSelect = ({ isActive, onClose, data }) => {
  const [active, setActive] = useState(isActive);
  const [ordersActive, setOrderActive] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActive(isActive);
  }, [isActive]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'orders'));
        const unsuscribe = onSnapshot(q, querySnapshot => {
          const updatedProducts = [];
          querySnapshot.forEach(doc => {
            updatedProducts.push({ id: doc.id, ...doc.data() });
          });
          setOrderActive(updatedProducts);
          setLoading(false);
        });
        return unsuscribe;
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = ordersActive.filter(product =>
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }) => (
    item.closed === '0' && (
      <TouchableOpacity
        style={styles.productButton}
        onPress={() => data(item.id)}
      >
        <Text style={styles.title}>#{item.id}</Text>
      </TouchableOpacity>
    )
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={active}
      onRequestClose={() => {
        setActive(false);
        onClose();
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.card}>
          <Text style={styles.title}>Seleccionar Orden Activa:</Text>

          {loading ? (
            <ActivityIndicator size="large" color="black" />
          ) : (
            <FlatList
              data={filteredProducts}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              numColumns={2}
              contentContainerStyle={styles.container}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width:'100%'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  productButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
});

export default ModalOrdersToSelect;
