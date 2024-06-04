import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthStack } from './authStack';
import { NavigationStack } from './navigationStack';
import LeftMenuWrapper from '../components/LeftMenuWrapper';

export const RootNavigation = () => {
  const { user } = useAuth();
  return (
    <>
      {user ? <NavigationStack /> : <AuthStack />}
      <LeftMenuWrapper />
    </>
  );
};
 