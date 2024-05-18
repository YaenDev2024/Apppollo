import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'

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
    viewSearchContainer:
    {
        flexGrow: 1,
        padding:20,
        flexDirection:'row'
    },
    textSearch:{
        color:'black',
        margin:20,
        fontWeight:'bold',
        fontSize:16
    },
    input:{
        borderColor: 'gray',
        borderWidth: 1,
        width:250,
        height:50,
        borderRadius:10,
        marginTop:10,
        color:'black'
    }

});
