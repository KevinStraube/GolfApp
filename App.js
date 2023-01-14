import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNavigator';
import LoginStack from './LoginStack';

export default function App() {
  return (
    <NavigationContainer>
      <LoginStack/>
    </NavigationContainer>
  );
}