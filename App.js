import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider,useAuth } from './authenticate/AuthProvider';
import RootNavigator from './authenticate/ProtectedGeneral';
import { ConfigProvider } from './config';

const MainNavigatior = () => {
  const {verifyUser} = useAuth()
  return (
    <NavigationContainer
      onStateChange={(state) => {
        
        // Track previous and current route names
        const currentRoute = state?.routes[state.index];
        console.log('Navigated to:', currentRoute?.name);
      }}>
      <RootNavigator />
    </NavigationContainer>
  );
};
export default function App() {
  return (
    <SafeAreaProvider>
      <ConfigProvider>
        <AuthProvider>
          <MainNavigatior />
        </AuthProvider>
      </ConfigProvider>
    </SafeAreaProvider>
  );
}
