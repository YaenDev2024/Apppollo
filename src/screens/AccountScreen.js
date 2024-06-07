import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  View,
  Switch,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import {NavBar} from '../components/NavBar';
import {ScrollView} from 'react-native';
import {BannerAd, BannerAdSize} from '@react-native-admob/admob';
import {auth, db} from '../../config';
import Icons from '../components/Icons';
import {TextInput} from 'react-native-gesture-handler';
import {addDoc, collection} from 'firebase/firestore';

const AccountScreen = () => {
  const [time, setTime] = useState(true);
  const signedUser = auth.currentUser;
  const [openMessageFeedBack, setOpenMessageFeedBack] = useState(false);
  const [textComments, setTextComments] = useState('');
  const [send,setSend] = useState(false)
  const getHighResImageUrl = url => {
    return url ? url.replace('s96-c', 's400-c') : null;
  };
  useEffect(() => {
    setTimeout(() => {
      setTime(false);
    }, 1000);
  }, [time]);

  const handleComments = () => {
    setOpenMessageFeedBack(true);
  };
  const handleClose = () => {
    setOpenMessageFeedBack(false);
  };

  const handleProduct = async () => {
    await addDoc(collection(db, 'feedback'), {
      mail: signedUser.email,
      userid: signedUser.displayName,
      comment: textComments,
    });
    setSend(true);
    setTextComments('')
    setTimeout(() => {
      setSend(false)
      setOpenMessageFeedBack(false)
    }, 2000);
  };
  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={'transparent'} barStyle="default" />
      {/* <NavBar name={'Cuenta personal'} /> */}
      {time ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.profileContainer}>
            <ImageBackground
              source={{uri: getHighResImageUrl(signedUser.photoURL)}}
              style={styles.profileImage}
              resizeMode="cover">
              <View style={styles.overlay}>
                <Text style={styles.nameText}>{signedUser.displayName}</Text>
                <Text style={styles.emailText}>{signedUser.email}</Text>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.menuContainerMain}>
            <View style={styles.containerEconomy}>
              <Icons name={'wallet'} sizes={25} />
              <Text style={styles.menuItemTextWallet}>Cartera</Text>
            </View>

            <View style={styles.menuItem}>
              <Text style={styles.menuItemText}>Metodo de Pago:</Text>
              <Icons name={'cc-paypal'} sizes={30} />
            </View>
            <View style={styles.menuItem}>
              <Icons name={'money'} sizes={20} />

              {/* <Text style={styles.menuItemText}>Saldo Total de Monedas</Text> */}
              {/* <Text style={styles.menuItemText}>1234</Text> */}
            </View>
            {/* <View style={styles.menuItem}>
              <Text style={styles.menuItemText}>Privacy</Text>
              <View style={styles.radioGroup}>
                <Text style={styles.radioText}>Private</Text>
                <Switch />
                <Text style={styles.radioText}>Public</Text>
                <Switch />
              </View>
            </View> */}
          </View>
          <View style={styles.menuContainer}>
            <View style={styles.menuSecondItem}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  width: '100%',
                }}
                onPress={handleComments}>
                <Icons name={'feedback'} sizes={25} />
                <Text style={styles.menuSecondItemText}>Comentarios</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menuSecondItem}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  width: '100%',
                }}>
                <Icons name={'file-contract'} sizes={25} />
                <Text style={styles.menuSecondItemText}>
                  Terminos y Condiciones
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuSecondItem}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  width: '100%',
                }}>
                <Icons name={'hide-source'} sizes={25} />
                <Text style={styles.menuSecondItemText}>Desactivar cuenta</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menuSecondItem}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  width: '100%',
                }}>
                <Icons name={'logoutt'} sizes={25} />
                <Text style={styles.menuSecondItemText}>Cerrar sesion</Text>
              </TouchableOpacity>
            </View>

            <Modal
              animationType="fade"
              transparent={true}
              visible={openMessageFeedBack}
              onRequestClose={handleClose}>
              <View style={styles.centeredView}>
                <View style={styles.card}>
                  <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={styles.closeButton}>
                      <Icons name={'times'} sizes={25} />
                    </View>
                  </TouchableWithoutFeedback>
                  <Text style={styles.titleCard}>Deja un comentario</Text>
                  <TextInput
                    placeholder="Agrega un comentario"
                    placeholderTextColor={'gray'}
                    style={{
                      borderWidth: 1,
                      borderRadius: 10,
                      color: 'black',
                      height: 100,
                      borderColor: '#D8D8D9',
                    }}
                    multiline={true}
                    maxLength={200}
                    onChangeText={(text) => setTextComments(text)}
                  />

                  <TouchableOpacity
                    style={styles.btnAdd}
                    onPress={() => handleProduct()}>
                    <Text style={styles.titlebtn}>Agregar</Text>
                  </TouchableOpacity>
                  {send ? (
                    <View>
                      <Text style={{color: 'green'}}>
                        Gracias por tus comentarios c:
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </Modal>
          </View>
          <BannerAd
            unitId="ca-app-pub-3477493054350988/1457774401"
            size={BannerAdSize.ADAPTIVE_BANNER}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  profileContainer: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  profileImage: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  overlay: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    alignItems: 'flex-start',
  },
  nameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  emailText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    marginBottom: 10,
  },
  menuContainer: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginBottom: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuContainerMain: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginBottom: 20,
    marginTop: -20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.01,
    shadowRadius: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingLeft: 55,
  },
  menuSecondItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: 'black',
    paddingBottom: 0,
  },
  menuSecondItemText: {
    fontSize: 16,
    color: 'black',
    paddingLeft: 20,
  },
  menuItemTextWallet: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    marginRight: 10,
    fontSize: 16,
    color: 'black',
  },
  containerEconomy: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  editbtn: {
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
    marginTop: 10,
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

export default AccountScreen;
