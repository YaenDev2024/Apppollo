import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {HomeScreen} from '../screens/HomeScreen';
import {MainPageInventory} from '../screens/inventory/MainPageInventory';
import { BuyScreen } from '../screens/BuyScreen';
import { OrderScreen } from '../screens/OrderScreen';
import { WinCoins } from '../screens/WinCoins';
import RuletaGame from '../screens/Games/RuletaGame';
import { TestPdf } from '../screens/tests/tstpdf';
import ShareExample from '../screens/tests/ticket';
import Createpdf from '../screens/tests/createpdf';
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
        <Stack.Screen name="Buy" component={BuyScreen} />
        <Stack.Screen name="Orders" component={OrderScreen} />
        <Stack.Screen name="Win" component={WinCoins} />
        <Stack.Screen name="Roulette" component={RuletaGame} />
        <Stack.Screen name="Ticket" component={TestPdf} />
        <Stack.Screen name="Share" component={ShareExample} />
        <Stack.Screen name="pdf" component={Createpdf} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
