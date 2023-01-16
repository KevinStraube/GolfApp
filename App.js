import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginStack from './LoginStack';

export default function App() {
  return (
    <NavigationContainer>
      <LoginStack/>
    </NavigationContainer>
  );
}