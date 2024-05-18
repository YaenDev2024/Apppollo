import React, { useState } from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View, Modal, FlatListComponent} from 'react-native';
import Icons from './Icons';
import { ModalProducts } from './ModalProducts';

export const ButtonsInventory = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [op,setOp] =useState(0)
    const handleEdit = () =>{
        setOp(1)
        setModalVisible(true)
    }
    const handleDelete = () =>{
        setOp(2)
        setModalVisible(true)
    } 
    const handleAdd = () =>{
        setOp(0)
        setModalVisible(true)
    }
  return (
    <View style={styles.containerButtons}>
      <TouchableOpacity style={styles.buttons} onPress={() => handleAdd()}>
        <Icons name={'plus'} sizes={30} />
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.buttons} onPress={() => handleEdit()}>
        <Icons name={'pencil'} sizes={30} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttons}  onPress={() => handleDelete()}>
        <Icons name={'trash'} sizes={30} />
      </TouchableOpacity> */}
      <ModalProducts active={modalVisible} option={op} setActive={setModalVisible} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerButtons: {
    flexGrow: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 20,
  },
  buttons: {
    padding: 10,
  },
});
