import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {HomeScreen} from '../screens/HomeScreen';
import {MainPageInventory} from '../screens/inventory/MainPageInventory';
const Stack = createStackNavigator();

export const NavigationStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Inventory" component={MainPageInventory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
