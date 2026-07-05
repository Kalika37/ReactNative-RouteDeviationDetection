import { createNativeStackNavigator } from '@react-navigation/native-stack';

//General Authentication
import Signup from '../components/auth/Signup';
import Login from '../components/auth/Login';

//General Auth
const Stack = createNativeStackNavigator();
import {useConfig} from '../config'
import AuthGuard from './AuthGuard';
export default function AuthStack() {
  const {BACKEND_HOST}=useConfig()
  return (
    <AuthGuard>
      <Stack.Navigator screenOptions={{
            headerShown: false,
          }}>
        <Stack.Screen name="Login">
          {(props) => <Login {...props} BackendHost={BACKEND_HOST} />}
        </Stack.Screen>
        <Stack.Screen name="Register">
          {(props) => <Signup {...props} BackendHost={BACKEND_HOST} />}
        </Stack.Screen>
      </Stack.Navigator>
    </AuthGuard>
  );
}
