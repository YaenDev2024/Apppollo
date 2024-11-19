import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Dimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icons from './Icons';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

export const SearchInput = ({setSearchTerm}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.containerInput}
      onPress={() =>
        navigation.navigate(
          'Search',
          {
            params: {},
          },
          {
            animation: 'slide_from_bottom',
          },
        )
      }>
      <Icons name="search" sizes={20} color="#000" style={styles.searchIcon} />
      <TextInput
        placeholder="Buscar productos..."
        style={styles.input}
        onChangeText={setSearchTerm}
        editable={false}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  searchIcon: {
    marginRight: 10,
    padding: 5, // Añadido para hacer el área tocable más grande
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: '#000',
  },
});

export default SearchInput;
