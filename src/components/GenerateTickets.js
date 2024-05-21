import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import pollo from '../../Assets/fnbg.png';

const GenerateTickets = () => {
  const [eventName, setEventName] = useState('El Pollo Tragon');
  const [order, setOrder] = useState('#0001');
  const [date, setDate] = useState('VIERNES, SEPTEMBER 19, 2024');
  const [name, setName] = useState('Tomas Acosta');
  const [price, setPrice] = useState('$20');
  const [total, setTotal] = useState(0);
  // Define el array de productos
  const products = [
    {qty: 1, item: 'Pollo Asado', price: '$20'},
    {qty: 2, item: 'Ensalada', price: '$10'},
    {qty: 1, item: 'Bebida', price: '$5'},
  ];
  const currentYear = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={pollo} />
      <View style={styles.containerName}>
        <Text style={styles.title}>Order {order}</Text>
        <Text style={styles.title}>Atendido por {name}</Text>
      </View>
      <Text style={styles.title}>{date}</Text>

      <View style={styles.containerTitle}>
        <Text style={styles.titleName}>QTY</Text>
        <Text style={styles.titleNameItem}>ITEM</Text>
        <Text style={styles.titleNamePrecio}>PRECIO</Text>
      </View>

      {/* Contenedor para todos los productos */}
      <View style={styles.productsContainer}>
        {products.map((product, index) => (
          <View key={index} style={styles.containerProductos}>
            <Text style={styles.productText}>{product.qty}</Text>
            <Text style={styles.productText}>{product.item}</Text>
            <Text style={styles.productText}>{product.price}</Text>
          </View>
        ))}
      </View>

      <View style={styles.containerTotal}>
        <Text style={styles.titleName}>QTY</Text>
        <Text style={styles.titleTotal}>$ {total}</Text>
      </View>
      <View style={styles.containertotal2}>
        <Text style={styles.titleName}>TOTAL</Text>
        <Text style={styles.titleTotal}>$ {total}</Text>
      </View>
      <View style={styles.containerPayment}>
        <Text style={styles.titleName}>Tipo de  pago:</Text>
        <Text style={styles.titleName}>Efectivo</Text>
      </View>
      <View style={styles.containerPaymentTotal}>
        <Text style={styles.titleName}>ID TRANS:</Text>
        <Text style={styles.titleName}>2021S6FW</Text>
      </View>
      <View style={styles.containerThanks}>
        <Text style={styles.titleName}>Gracias por comprar aqui!</Text>
      </View>
      <Text style={styles.copyright}>© {currentYear} El Pollo Tragon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    padding: 20,
    border:1,
    borderColor:'black',
    borderWidth:2
  },
  containerTotal: {
    borderTopColor: 'black',
    borderTopWidth: 1,
    flexDirection: 'row',
    width: '100%',
    paddingBottom: 5,
  },
  containerPaymentTotal:{
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    flexDirection: 'row',
    width: '100%',
    paddingBottom: 5,
  },
  containerPayment:{
    flexDirection:'row',
    width: '100%',
    paddingBottom: 5,

  },
  containertotal2: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    flexDirection: 'row',
    width: '100%',
    paddingBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    textAlign: 'left',
  },
  containerName: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
  },
  containerTitle: {
    flexDirection: 'row',
    borderTopColor: 'black',
    borderTopWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  titleName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
    width: '33%',
    textAlign: 'center',
    marginTop: 10,
  },
  titleTotal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
    width: '33%',
    textAlign: 'right',
    marginTop: 10,
    position: 'absolute',
    left: 190,
  },
  titleNameItem: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
    width: '34%',
    textAlign: 'center',
    marginTop: 10,
  },
  titleNamePrecio: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
    width: '33%',
    textAlign: 'center',
    marginTop: 10,
  },
  productsContainer: {
    borderTopColor: 'black',
    borderTopWidth: 1,
    width: '100%',
  },
  containerProductos: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  productText: {
    fontSize: 12,
    color: 'black',
    width: '33%',
    textAlign: 'center',
  },
  copyright: {
    marginTop: 0,
    fontSize: 12,
    color: 'gray',
  },
});

export default GenerateTickets;
