import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Location from "expo-location";
import * as Application from "expo-application";

import { requestNotificationPermission } from "../../firebase/notify";

export const getDeviceId = async () => {
  let deviceId =
    await AsyncStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId =
      Application.androidId ||
      Application.applicationId ||
      `${Date.now()}-${Math.random()}`;

    await AsyncStorage.setItem(
      "deviceId",
      deviceId
    );
  }

  return deviceId;
};

export const getPlatform = () => {
  if (Device.osName === "Android")
    return "Android";

  if (Device.osName === "iOS")
    return "iOS";

  return "Unknown";
};

export const getFcmToken = async () => {
  return await requestNotificationPermission();
};

export const getLocation = async () => {
  try {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return null;
    }

    const location =
      await Location.getCurrentPositionAsync({
        accuracy:
          Location.Accuracy.High,
      });

    return {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};