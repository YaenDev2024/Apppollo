import React, {useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
  SectionListComponent,
  Button,
} from 'react-native';
import Icons from './Icons';
import {doc, addDoc, collection} from 'firebase/firestore';
import {db} from '../../config';
import {Picker} from '@react-native-picker/picker';
import ImagePicker, { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';


export const ModalProducts = ({active, setActive, option}) => {

  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [size, setSize] = useState('');
  const [check, setCheck] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [source, setSource] = useState({});

  const handleProduct = () => {
    if (
      name === undefined ||
      name === '' ||
      qty === undefined ||
      qty === '' ||
      size === undefined ||
      size === ''
    ) {
      Alert.alert(
        'Error',
        'Los campos no pueden ir vacíos, Revisa nuevamente, por favor.',
      );
    } else {
      create();
      setCheck(true);
      setSize('');
      setName('');
      setQty('');
      
    }
  };

  function create() {
    uploadImageToFirebase(source.uri);
 
  }
  const handleClose = () => {
    setActive(false);
    setCheck(false);
  };

  const handleName = text => {
    setName(text);
  };
  const handleQty = text => {
    setQty(text);
  };
  const handleSize = text => {
    setSize(text);
  };

  const openImagePicker = () => {
    let options = {
      storageOptions: {
        path: 'image',
      },
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setSource({ uri: response.assets[0].uri });
        //uploadImageToFirebase(source.uri);
      }
    });
  };

  const uploadImageToFirebase = async (imageUri) => {

    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const storageRef = storage().ref(`images/${filename}`);
    
    const uploadTask = storageRef.putFile(imageUri);
  
    uploadTask.on('state_changed', (snapshot) => {
      console.log('Progress: ', (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    }, (error) => {
      console.error(error);
    }, () => {
      storageRef.getDownloadURL().then((downloadURL) => {
        console.log('File available at: ', downloadURL);
          addFoodDocument(name,qty,size,downloadURL);
      });
    });
  };
  
const addFoodDocument = async (name, qty, size, downloadURL) => {
  try {
    const docRef = await addDoc(collection(db, 'food'), {
      name: name,
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
    <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={active}
          onRequestClose={() => {
            setActive(false);
            setCheck(false);
          }}>
          <View style={style.centeredView}>
            <View style={style.card}>
              <Text style={style.titleCard}>Agregar Producto </Text>
              <TouchableWithoutFeedback onPress={() => handleClose()}>
                <View style={style.closeButton}>
                  <Icons name={'times'} sizes={25} />
                </View>
              </TouchableWithoutFeedback>
              <View style={style.rowContainer}>
                <Text style={style.title}>Nombre: </Text>
                <TextInput
                  placeholder="Nombre del producto"
                  placeholderTextColor={'gray'}
                  style={style.input}
                  onChangeText={handleName}
                />
              </View>
              <View style={style.rowContainer}>
                <Text style={style.title}>Cantidad:</Text>
                <TextInput
                  inputMode="decimal"
                  placeholder="Cantidad del producto"
                  placeholderTextColor={'gray'}
                  style={style.input}
                  onChangeText={handleQty}
                />
              </View>
              <View style={style.rowContainer}>
                <Text style={style.title}>Peso:       </Text>
                <TextInput
                  inputMode="decimal"
                  placeholder="Peso del producto"
                  placeholderTextColor={'gray'}
                  style={style.input}
                  onChangeText={handleSize}
                />
              </View>
              <View style={style.rowContainer}>
                <Text style={style.title}>Url: </Text>
                <Button
                  title="Choose from Device"
                  onPress={openImagePicker}

                />
               
              </View>
              <TouchableOpacity
                style={style.btnAdd}
                onPress={() => handleProduct()}>
                <Text style={style.titlebtn}>Agregar</Text>
              </TouchableOpacity>
              <View style={check ? style.success : ''}>
                <Icons name={'check'} sizes={25} />
              </View>
            </View>
          </View>
        </Modal>
    </View>
  );
};

const style = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  editbtn:{
    position: 'absolute',
    top: 20,
    right: 0,
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
  title: {
    color: 'black',
    marginRight: 10,
    fontWeight: 'bold',
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
    marginTop:10,
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
});
