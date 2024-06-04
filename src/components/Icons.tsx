import React from 'react';
import type {PropsWithChildren} from 'react';

import Icon from 'react-native-vector-icons/FontAwesome';

type IconsProps = PropsWithChildren<{
  name: String;
  sizes: number;
}>;

const Icons = ({name, sizes}: IconsProps) => {
  switch (name) {
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
    default:
      break;
  }
};

export default Icons;
