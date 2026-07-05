import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import SOSDashboard from '../components/dashboard/SOSDashboard';
import Alerts from '../components/Alerts';
import EmergencyContactsList from '../components/Contacts';
import Profile from '../components/Profile';
import Devices from '../components/device/Devices';
import DeviceProfile from '../components/device/DeviceDetail';
import AppGuard from './AppGuard';
import {useConfig} from '../config'
import RoutePicker from "../map/RoutePicker"   
import RouteLiveTracking from "../map/LiveTracking"   


export default function MapStack() { 
  const {BACKEND_HOST}=useConfig()
  return (
    <AppGuard>
      <Stack.Navigator screenOptions={{
            headerShown: false,
          }}>
        <Stack.Screen name="LiveTracking">
          {(props) => <RouteLiveTracking {...props} BackendHost={BACKEND_HOST} />}
        </Stack.Screen>
        <Stack.Screen name="RoutePicker">
          {(props) => (
            <RoutePicker {...props} BackendHost={BACKEND_HOST} />
          )}
        </Stack.Screen>

        
      </Stack.Navigator>
    </AppGuard>
  );
}
