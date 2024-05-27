import React from 'react';
import { StyleSheet, Text, TextInput, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Obtener el ancho de la pantalla

export const SearchInput = ({ setSearchTerm }) => {
  return (
    <View style={styles.viewSearchContainer}>
      <Text style={styles.textSearch}>Buscar: </Text>
      <TextInput 
        style={styles.input} 
        placeholderTextColor={'gray'} 
        placeholder='Buscar producto'
        onChangeText={text => setSearchTerm(text)} // Actualiza el término de búsqueda
      />
    </View>
  )
}

const styles = StyleSheet.create({
  viewSearchContainer: {
    flexGrow: 1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textSearch: {
    color: 'black',
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    flex: 1, // Flex para ocupar el espacio disponible
    height: 40, // Altura fija
    borderRadius: 10,
    paddingLeft: 10, // Padding interno
    color: 'black',
  },
});

export default SearchInput;
