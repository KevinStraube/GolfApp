import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginStack from './LoginStack';
import { AuthProvider } from './hooks/useAuth';

export default function App() {
  return (
    <NavigationContainer>
        <AuthProvider>
          <LoginStack/>
        </AuthProvider>
    </NavigationContainer>
  );
}