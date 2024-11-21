import React from 'react';
import type {PropsWithChildren} from 'react';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import M from 'react-native-vector-icons/FontAwesome6';
import Material from 'react-native-vector-icons/MaterialIcons';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

type IconsProps = PropsWithChildren<{
  name: String;
  sizes: number;
  ColorsDA: string;
}>;

const Icons = ({name, sizes, ColorsDA}: IconsProps) => {
  switch (name) {
    case 'search':
      return <Icon name="search" size={sizes} color={'#dadada'} />;
      break;
    case 'bars':
      return <Icon name="bars" size={sizes} color={'red'} />;
      break;
    case 'logout':
      return <Icon name="sign-out" size={sizes} color={'red'} />;
      break;
    case 'plus':
      return <Icon name="plus" size={sizes} color={'green'} />;
      break;
    case 'pencil':
      return <Icon name="pencil" size={sizes} color={'red'} />;
      break;
    case 'trash':
      return <Icon name="trash" size={sizes} color={'red'} />;
      break;
    case 'shopping-cart':
      return <Icon name="shopping-cart" size={sizes} color={'red'} />;
      break;
    case 'times':
      return <Icon name="times" size={sizes} color={'gray'} />;
      break;
    case 'close':
      return <Icon name="times" size={sizes} color={'red'} />;
      break;
    case 'check':
      return <Icon name="check" size={sizes} color={'white'} />;
      break;
    case 'home':
      return <Icon name="home" size={sizes} color={'gray'} />;
      break;
    case 'cog':
      return <Icon name="cog" size={sizes} color={'gray'} />;
      break;
    case 'user':
      return <Icon name="user" size={sizes} color={'gray'} />;
      break;
    case 'info-circle':
      return <Icon name="info-circle" size={sizes} color={'gray'} />;
      break;
    case 'wallet':
      return <M name="wallet" size={sizes} color={'gray'} />;
      break;
    case 'cc-paypal':
      return <Icon name="cc-paypal" size={sizes} color={'#DE3A3A'} />;
      break;
    case 'feedback':
      return <Material name="feedback" size={sizes} color={'gray'} />;
      break;
    case 'file-contract':
      return <M name="file-contract" size={sizes} color={'gray'} />;
      break;
    case 'hide-source':
      return <Material name="hide-source" size={sizes} color={'gray'} />;
      break;
    case 'logoutt':
      return <Material name="logout" size={sizes} color={'gray'} />;
      break;
    case 'cog-outline':
      return <MaterialC name="cog-outline" size={sizes} color={'white'} />;
      break;
    case 'ad':
      return <Icon5 name="ad" size={sizes} color={'#DE3A3A'} />;
      break;
    case 'cash-plus':
      return <MaterialC name="cash-plus" size={sizes} color={'#DE3A3A'} />;
      break;
    case 'arrow-left':
      return <Icon name="arrow-left" size={sizes} color={'#DE3A3A'} />;
      break;
    case 'arrow-rigth':
      return <Icon name="arrow-right" size={sizes} color={'white'} />;
      break;
    case 'arrow-right':
      return <Icon name="arrow-right" size={sizes} color={ColorsDA} />;
      break;
    case 'cash':
      return <MaterialC name="cash-refund" size={sizes} color={'white'} />;
      break;
    case 'hearts':
      return <MaterialC name="heart" size={sizes} color={'red'} />;
      break;
    case 'back-in-time':
      return <Entypo name="back-in-time" size={sizes} color={'gray'} />;
      break;
    case 'heart':
      return <AntDesign name="heart" size={sizes} color={'red'} />;
      break;
    case 'hearto':
      return <AntDesign name="hearto" size={sizes} color={'red'} />;
      break;
    default:
      break;
  }
};
export default Icons;
