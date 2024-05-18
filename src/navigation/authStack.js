import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {WelcomeScreen} from '../screens/WelcomeScreen';
import {Register} from '../screens/Register';
import {Login} from '../screens/Login';
import {HomeScreen} from '../screens/HomeScreen';
import {MainPageInventory} from '../screens/inventory/MainPageInventory';
const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Sign In" component={Login} />
        <Stack.Screen name="Sign Up" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
