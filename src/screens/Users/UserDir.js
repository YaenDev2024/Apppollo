import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icons from '../../components/Icons';
import {useNavigation} from '@react-navigation/native';
import {Text} from 'react-native';
const COLORS = {
  dark: 'black',
  darkSecondary: '#4A311F',
  primary: '#FFD23F',
  primaryLight: '#FFE584',
  accent: '#FF6B6B',
  background: 'white',
};
const UserDir = () => {
  const navigation = useNavigation();

  const [listDir, setListDir] = useState([]);

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
          Direcciones
        </Text>
      </View>
      <View>
        {listDir && listDir.length > 0 ? (
          <View>
            <Text
              style={{textAlign: 'center', fontSize: 20, color: COLORS.dark}}>
              Direcciones
            </Text>
            {listDir.map((item, index) => (
              <View key={item.id}>
                <Text>{item.title}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View>
            <Text
              style={{textAlign: 'center', fontSize: 20, color: COLORS.dark}}>
              No tienes direcciones guardadas
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

export default UserDir;
