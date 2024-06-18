import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, Button, Alert} from 'react-native';
import pollo from '../../Assets/fnbg.png';
import Createpdf from '../screens/tests/createpdf';
import ViewShot from 'react-native-view-shot';
import {auth, db} from '../../config';
import storage from '@react-native-firebase/storage';
import RNPrint from 'react-native-print';
import PrintImage from '../screens/tests/Print';


const GenerateTickets = ({productsss}) => {
  const [eventName, setEventName] = useState('El Pollo Tragon');
  const signedUser = auth.currentUser;
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [imageURI, setImageURI] = useState(null);
  const currentYear = new Date().getFullYear();
  const ref = useRef();

  const captureTicket = () => {
    // on mount
    ref.current.capture().then(uri => {
      console.log('do something with ', uri);
      uploadImageToFirebase(uri);
    });
  };


  useEffect(() => {
    setName(signedUser.displayName)
  }, [])
  
  const uploadImageToFirebase = async imageUri => {
    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const storageRef = storage().ref(`images/${filename}`);

    const uploadTask = storageRef.putFile(imageUri);

    uploadTask.on(
      'state_changed',
      snapshot => {
        console.log(
          'Progress: ',
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
      },
      error => {
        console.error(error);
      },
      () => {
        storageRef.getDownloadURL().then(downloadURL => {
          console.log('File available at: ', downloadURL);
          setImageURI(downloadURL)
        });
      },
    );
  };
  return (
    <ScrollView >
      <ViewShot
        ref={ref}
        options={{fileName: 'Your-File-Name', format: 'jpg', quality: 0.9}} style={styles.container} >
        <Image style={styles.image} source={pollo} />
        <View style={styles.containerName}>
          <Text style={styles.title}>Order #{productsss.id}  </Text>
          <Text style={styles.title}>Atendido por {name}</Text>
        </View>
        <Text style={styles.title}>{date.toLocaleString()}</Text>

        <View style={styles.containerTitle}>
          <Text style={styles.titleName}>QTY</Text>
          <Text style={styles.titleNameItem}>ITEM</Text>
          <Text style={styles.titleNamePrecio}>PRECIO</Text>
        </View>

        <View style={styles.productsContainer}>
          {productsss.item.map((product, index) => (
            <View key={index} style={styles.containerProductos}>
              <Text style={styles.productText}>{product.qty}</Text>
              <Text style={styles.productText}>{product.item}</Text>
              <Text style={styles.productText}>${product.price}</Text>
            </View>
          ))}
        </View>

        <View style={styles.containerTitle}>
          <Text style={styles.titleName}>QTY</Text>
          <Text style={styles.titleTotal}>{productsss.qty}</Text>
        </View>
        <View style={styles.containerTitle2}>
          <Text style={styles.titleName}>TOTAL</Text>
          <Text style={styles.titleTotal}>$ {productsss.price}</Text>
        </View>
        <View style={styles.containerPayment}>
          <Text style={styles.titleName}>Tipo de pago:</Text>
          <Text style={styles.titleName}>Efectivo</Text>
        </View>
        <View style={styles.containerPaymentTotal}>
          <Text style={styles.titleName}>ID TRANS:</Text>
          <Text style={styles.titleName}>2021S6FW</Text>
        </View>
        <View style={styles.containerThanks}>
          <Text style={styles.titleName}>Gracias por comprar aquí!</Text>
        </View>
        <Text style={styles.copyright}>© {currentYear} El Pollo Tragon</Text>
      </ViewShot>
      <Button title="Generar PDF" onPress={captureTicket} />
      {imageURI ? <PrintImage image={imageURI} /> : ''}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    padding: 20,
    borderWidth: 2,
    borderColor: 'black',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    textAlign: 'left',
  },
  containerName: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    width: '100%',
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
  containerTitle2: {
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
  },
  titleName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    width: '33%',
    textAlign: 'center',
    marginTop: 10,
  },
  titleTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    width: '33%',
    textAlign: 'right',
    marginTop: 10,
  },
  titleNameItem: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    width: '34%',
    textAlign: 'center',
    marginTop: 10,
  },
  titleNamePrecio: {
    fontSize: 14,
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
    fontSize: 14,
    color: 'black',
    width: '33%',
    textAlign: 'center',
  },
  containerPayment: {
    flexDirection: 'row',
    width: '100%',
    paddingBottom: 5,
  },
  containerPaymentTotal: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    flexDirection: 'row',
    width: '100%',
    paddingBottom: 5,
  },
  containerThanks: {
    marginTop: 10,
  },
  copyright: {
    marginTop: 10,
    fontSize: 12,
    color: 'gray',
  },
});

export default GenerateTickets;
