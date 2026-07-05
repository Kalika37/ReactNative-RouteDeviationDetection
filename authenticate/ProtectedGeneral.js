import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from './AuthProvider';

import AuthStack from './AuthStack';
import AppStack from './AppStack';
import MapStack from './mapStack';
import AdminAppStack from './AdminAppStack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="App"
          screenOptions={{
            headerShown: false, 
          }}>
      <Stack.Screen name="App" component={AppStack} />
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="Map" component={MapStack} />
      <Stack.Screen name="Admin" component={AdminAppStack} />
    </Stack.Navigator>
  );
}
