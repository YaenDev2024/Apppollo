// MenuContext.js
import React, { createContext, useState } from 'react';

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);

  return (
    <MenuContext.Provider value={{ menuVisible, showMenu, hideMenu }}>
      {children}
    </MenuContext.Provider>
  );
};
