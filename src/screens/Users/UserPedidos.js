import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icons from '../../components/Icons';
import {useNavigation} from '@react-navigation/native';
import {Text} from 'react-native';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from '../../../config';
const COLORS = {
  dark: 'black',
  darkSecondary: '#4A311F',
  primary: '#FFD23F',
  primaryLight: '#FFE584',
  accent: '#FF6B6B',
  background: 'white',
};
const UserPedidos = () => {
  const navigation = useNavigation();

  const [listPedidos, setListPedidos] = useState([]);
  useEffect(() => {
    const getlistPedidos = async () => {
      const signedInUser = auth.currentUser;
      const getUserid = await getDocs(
        query(collection(db, 'users'), where('mail', '==', signedInUser.email)),
      );
      getUserid.forEach(doc => {
        const unsubscribe = onSnapshot(
          query(collection(db, 'pedidos'), where('iduser', '==', doc.id)),
          snapshot => {
            setListPedidos(
              snapshot.docs.map(doct => ({id: doct.id, ...doct.data()})),
            );
          },
        );
      });
    };
    getlistPedidos();
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        {/* BOTONES */}
        <TouchableOpacity
          style={styles.btnrounded}
          onPress={() => navigation.goBack()}>
          <Icons name="arrow-left" sizes={25} color={COLORS.dark} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            marginTop: 10,
            fontWeight: 'bold',
            color: COLORS.dark,
          }}>
          Pedidos
        </Text>
      </View>
      <View>
        {listPedidos && listPedidos.length > 0 ? (
          <View>
            <Text
              style={{textAlign: 'center', fontSize: 20, color: COLORS.dark}}>
              Pedidos
            </Text>
            {listPedidos.map((item, index) => (
              <View key={item.id}>
                <Text>{item.title}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View>
            <Text
              style={{textAlign: 'center', fontSize: 20, color: COLORS.dark}}>
              No hay pedidos
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  btnrounded: {
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 90,
    elevation: 0,
  },
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: COLORS.background,
  },
});

export default UserPedidos;
