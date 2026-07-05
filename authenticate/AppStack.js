import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import SOSDashboard from '../components/dashboard/SOSDashboard';
import Alerts from '../components/Alerts';
import EmergencyContactsList from '../components/Contacts';
import Profile from '../components/Profile';
import Devices from '../components/device/Devices';
import DeviceProfile from '../components/device/DeviceDetail';
import ProfileDashboard from "../Profile/ProfileDashboard"
import AppGuard from './AppGuard';
import {useConfig} from '../config'
export default function AppStack() { 
  const {BACKEND_HOST}=useConfig()
  return (
    <AppGuard>
      <Stack.Navigator screenOptions={{
            headerShown: false,
          }}>
        <Stack.Screen name="Dashboard">
          {(props) => <SOSDashboard {...props} BackendHost={BACKEND_HOST} />}
        </Stack.Screen>
        <Stack.Screen name="Contacts">
          {(props) => (
            <EmergencyContactsList {...props} BackendHost={BACKEND_HOST} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Alerts">
          {(props) => <Alerts {...props} BackendHost={BACKEND_HOST} />}
        </Stack.Screen>

        <Stack.Screen name="Devices">
          {(props) => <Devices {...props} BackendHost={BACKEND_HOST} />}
        </Stack.Screen>

        <Stack.Screen
          name="DeviceDetail"
          component={DeviceProfile}
          initialParams={{
            BackendHost:BACKEND_HOST,
          }}
        />
        <Stack.Screen name="Profile">
          {(props) => <ProfileDashboard {...props} BackendHost={BACKEND_HOST} />}
        </Stack.Screen>
      </Stack.Navigator>
    </AppGuard>
  );
}
