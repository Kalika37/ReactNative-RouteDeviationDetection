import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboard from '../admin/pages/AdminDashboard';
import AdminDevices from '../admin/pages/Devices';
import AdminUsers from '../admin/pages/Users';
import AdminDeviceDetails from '../admin/pages/Admin_Device_Management';
const Stack = createNativeStackNavigator();
import AdminGuard from './AdminGuard';
import {useConfig} from '../config'
export default function AdminAppStack() {
  const {BACKEND_HOST} =useConfig()
  return (
    <AdminGuard>
      <Stack.Navigator screenOptions={{
            headerShown: false,
          }}>
        <Stack.Screen name="AdminDashboard">
          {(props) => <AdminDashboard {...props} BackendHost={BACKEND_HOST} />}
        </Stack.Screen>

        <Stack.Screen name="AdminDevices">
          {(props) => <AdminDevices {...props} BackendHost={BACKEND_HOST} />}
        </Stack.Screen>

        <Stack.Screen name="AdminUsers">
          {(props) => <AdminUsers {...props} BackendHost={BACKEND_HOST} />}
        </Stack.Screen>

        <Stack.Screen
          name="AdminDeviceDetails"
          component={AdminDeviceDetails}
          initialParams={{
            BackendHost:BACKEND_HOST,
          }}
        />
      </Stack.Navigator>
    </AdminGuard>
  );
}
