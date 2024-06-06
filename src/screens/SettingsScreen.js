import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Switch,
  Button,
  Alert,
} from 'react-native';
import {NavBar} from '../components/NavBar';
import {BannerAd, BannerAdSize} from '@react-native-admob/admob';
import {auth, db} from '../../config';
import Icons from '../components/Icons';
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {TextInput} from 'react-native-gesture-handler';

const SettingsScreen = () => {
  const [time, setTime] = useState(true);
  const signedInUser = auth.currentUser;
  const [isEnabledInApp, setIsEnabledInApp] = useState(false);
  const [isEnabledBanner, setIsEnabledBanner] = useState(false);
  const [id, setId] = useState('');
  const [saved, setSaved] = useState(false);
  const [mailPaypal, setMailPaypal] = useState('');

  const toggleSwitchInAddOpen = () =>
    setIsEnabledInApp(previousState => !previousState);
  const toggleSwitchBannerMore = () =>
    setIsEnabledBanner(previousState => !previousState);

  const onChangeMail = text => {
    setMailPaypal(text);
  };

  const handleSaveChanges = async () => {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regexCorreo.test(mailPaypal)) {
      
      if (
        mailPaypal === null ||
        mailPaypal === undefined ||
        mailPaypal === ''
      ) {
        Alert.alert('Error', 'El correo de Paypal no puede estar vacio');
      } else {
        const updateProduct = doc(db, 'ads', id);
        setSaved(true);
        await updateDoc(updateProduct, {
          AdOpenApp: isEnabledInApp,
          PlusBanner: isEnabledBanner,
          Paypal: mailPaypal,
        }).then(
          setTimeout(() => {
            setSaved(false);
          }, 1000),
        );
      }
    } else {
      Alert.alert('Correo no válido');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setTime(false);
    }, 1000);

    const fetchAds = async () => {
      const q = query(
        collection(db, 'ads'),
        where('mail', '==', signedInUser.email),
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach(doc => {
          setId(doc.id);
          setMailPaypal(signedInUser.email);
          setIsEnabledBanner(doc.data().PlusBanner);
          setIsEnabledInApp(doc.data().AdOpenApp);
        });
      }
    };

    fetchAds();
  }, [time]);

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../../Assets/fondo.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={{opacity: 0.08}}>
        <StatusBar backgroundColor={'#3E6FC4'} barStyle="light-content" />
        {/* <NavBar name={'Ajustes'} /> */}
        {time ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
              <View style={styles.header}>
                <View style={styles.headerTitlesContainer}>
                  <Text style={styles.headerTitle}>Ajustes</Text>
                  <Icons name={'cog-outline'} sizes={25} />
                </View>
                <View style={styles.userContainer}>
                  <Image
                    style={styles.userImage}
                    source={{uri: signedInUser.photoURL}}
                  />
                  <Text style={styles.userName}>
                    {signedInUser.displayName}
                  </Text>
                </View>
              </View>
              <View style={styles.cardContainer}>
                <View style={styles.card}>
                  <Icons name={'ad'} sizes={25} />
                  <Text style={styles.cardText}>
                    Publicidad al abrir la app
                  </Text>
                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={isEnabledInApp ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitchInAddOpen}
                    value={isEnabledInApp}
                  />
                </View>
                <View style={styles.card}>
                  <Icons name={'cash-plus'} sizes={25} />
                  <Text style={styles.cardText}>Permitir +1 Banner extra</Text>
                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={isEnabledBanner ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitchBannerMore}
                    value={isEnabledBanner}
                  />
                </View>
                <View style={styles.card}>
                  <Icons name={'cc-paypal'} sizes={25} />
                  <TextInput
                    style={{
                      borderBottomColor: 'gray',
                      borderBottomWidth: 0.5,
                      opacity: 0.5,
                      color: 'gray',
                    }}
                    onChangeText={onChangeMail}
                    inputMode="email"
                    placeholder={signedInUser.email}
                    placeholderTextColor={'gray'}></TextInput>
                </View>
                {/* <View style={styles.card}>
                  <Text style={styles.cardText}>Gateway credential</Text>
                  <Switch />
                </View>
                <View style={styles.card}>
                  <Text style={styles.cardText}>Store</Text>
                  <Switch />
                </View> */}
                <View style={styles.card}>
                  <Button title="Guardar" onPress={handleSaveChanges} />
                  {saved ? (
                    <Text style={{color: 'green'}}>Guardado con exito!</Text>
                  ) : null}
                </View>
              </View>
            </View>
            <BannerAd
              unitId="ca-app-pub-3477493054350988/1457774401"
              size={BannerAdSize.ADAPTIVE_BANNER}
            />
          </ScrollView>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#D3D4DA',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#3E6FC4',
    width: '100%',
    paddingVertical: 30,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  headerTitlesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  settingsIcon: {
    color: 'white',
  },
  cardContainer: {
    width: '90%',
    alignItems: 'center',
    marginTop: -20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  card: {
    backgroundColor: 'white',
    width: '90%',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 5,
    justifyContent: 'space-between',
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
