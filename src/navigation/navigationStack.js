// navigationStack.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from '../screens/HomeScreen';
import {MainPageInventory} from '../screens/inventory/MainPageInventory';
import {BuyScreen} from '../screens/BuyScreen';
import {OrderScreen} from '../screens/OrderScreen';
import {WinCoins} from '../screens/WinCoins';
import RuletaGame from '../screens/Games/RuletaGame';
import {TestPdf} from '../screens/tests/tstpdf';
import ShareExample from '../screens/tests/ticket';
import Createpdf from '../screens/tests/createpdf';
import CombosList from '../screens/buy/CombosList';
import LeftMenuWrapper from '../components/LeftMenuWrapper';
import AccountScreen from '../screens/AccountScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import QuizGame from '../screens/Games/QuizGame';
import ProductScreenDesc from '../screens/Products/ProductScreenDesc';
import UserPerfil from '../screens/Users/UserPerfil';
import UserConfig from '../screens/Users/UserConfig';
import SearchProducs from '../screens/Products/SearchProducs';
import {CardStyleInterpolators} from '@react-navigation/stack';
import UserPedidos from '../screens/Users/UserPedidos';
import UserFav from '../screens/Users/UserFav';
import UserPoints from '../screens/Users/UserPoints';
import UserDir from '../screens/Users/UserDir';
import ConfigInfoPersonal from '../screens/Config/ConfigInfoPersonal';
import PayScreen from '../screens/Orders/PayScreen';
import BuyScreenDetail from '../screens/Orders/BuyScreenDetail';
import CartScreen from '../screens/Products/CartScreen';
const Stack = createStackNavigator();

export const NavigationStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // o prueba "forFadeFromBottomAndroid"
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Inventory" component={MainPageInventory} />
      <Stack.Screen name="Buy" component={BuyScreen} />
      <Stack.Screen name="Orders" component={OrderScreen} />
      <Stack.Screen name="Win" component={WinCoins} />
      <Stack.Screen name="Roulette" component={RuletaGame} />
      <Stack.Screen name="Quiz" component={QuizGame} />
      <Stack.Screen name="Ticket" component={TestPdf} />
      <Stack.Screen name="Share" component={ShareExample} />
      <Stack.Screen name="pdf" component={Createpdf} />
      <Stack.Screen name="Combos" component={CombosList} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ProductDescBuy" component={ProductScreenDesc} />
      <Stack.Screen name="UserPerfil" component={UserPerfil} />
      <Stack.Screen name="ConfigUser" component={UserConfig} />
      <Stack.Screen name="Search" component={SearchProducs} />
      <Stack.Screen name="UserPedidos" component={UserPedidos} />
      <Stack.Screen name="UserFav" component={UserFav} />
      <Stack.Screen name="UserPoints" component={UserPoints} />
      <Stack.Screen name="UserDir" component={UserDir} />
      <Stack.Screen name="ConfigInfoPersonal" component={ConfigInfoPersonal} />
      <Stack.Screen name="Pay" component={PayScreen} />
      <Stack.Screen name="BuyScreenDetail" component={BuyScreenDetail} />
      <Stack.Screen name='CartScreen' component={CartScreen} />
    </Stack.Navigator>
  );
};
