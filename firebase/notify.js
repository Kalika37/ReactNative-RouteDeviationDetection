import { getToken } from 'firebase/messaging';
// import { messaging } from "./firebase";
import * as Notifications from 'expo-notifications';
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notifications.requestPermissionsAsync();

    if (permission.status !== 'granted') {
      console.log('Permission denied');
      return;
    }

    // const token = await getToken(messaging, {
    //   vapidKey: "BCr2HA1qPIaQExEWGEkmys-UlOIG3eBtXaFdagfWDG4CiEqEAkPwnZ23WW1PBLT6-CxemWn_td5XQ0w9ZV1Xvwg",
    // });

    const token = (await Notifications.getExpoPushTokenAsync()).data;

    console.log('FCM Token:', token);

    // Send token to backend
    return token;
  } catch (error) {
    console.error(error);
  }
};
